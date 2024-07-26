---
title: Writing My Own Language Server in Go (to Parse Chess PGNs)
publishedTime: 2024-06-26
---

<!--toc:start-->

-   [What is a Language Server?](#what-is-a-language-server)
-   [What is a Chess PGN?](#what-is-a-chess-pgn)
-   [What can this language server do?](#what-can-this-language-server-do)
-   [Making the Server](#making-the-server)
    -   [Notes and Issues](#notes-and-issues)
    -   [The Protocol](#the-protocol)
    -   [Analysis](#analysis)
-   [Conclusion](#conclusion)
<!--toc:end-->

### What is a Language Server?

If you're unfamiliar, the Language Server Protocol is a protocol by which a client (usually a code editor) can talk to a language server and get information about an open file and/or workspace. This is made use of in editors like VS Code and Neovim (my editor of choice, by the way). The protocol passes data around in JSON which essentially allows for an RPC where the client tells the server to do something or vice versa. These can be built in any language, as long as said language supports whatever transport method you choose for the JSON RPC (usually stdout and stdin, but TCP is another example of an option). For this language server I built it in Go using stdout and stdin.

### What is a Chess PGN?

This may be the one fewer reading this have heard of, so what is a PGN? PGN (Portable Game Notation) is the format in which most chess games are stored digitally. A PGN file can hold a single game or an entire database of games, but for this basic LSP implementation I have assumed that the user is editing single game files, which is a big limiting factor, so be warned if you decide to use this. The PGN standard consists of two main parts: tag pairs and moves. The tag pairs store metadata about the game, while the moves are understandably the moves of the game. There are 7 required tags in the standard to define a game, and the moves are recorded in Standard Algebraic Notation (i.e. Ke2). I won't go too heavily into the specification of the standard here because I decided against writing my own parser (although not before creating a lexer when my initial playing around with existing parsers frustrated me), but if you want to read up on it, it is an interesting spec in and of itself.

### What can this language server do?

In its current basic form, it can parse a PGN of a single chess game, report errors with the parsing, and suggest legal moves as completions.

## Making the Server

### Notes and Issues

Since this was my first time ever creating a language server, I no doubt made some mistakes, and I'm also fairly new to Go, so I have no doubt that will have contributed to any issues as well, but all that being said, this went over pretty painlessly. I had some hiccups with the parser itself, but as far as implementing the protocol it went off without much of a hitch. The only real warning I'd give to people following suit on this is that you should probably design your analysis tool before doing much else because the way I did it, I felt a lot like I was jumping around my codebase continuously adding and removing from the LSP to fit the demands of the analysis tool. That might seem self-evident, especially if you're writing a language server for a programming language, but I figured I should mention it.

### The Protocol

I started with the help of TJ Devries' [educationalsp repo](https://github.com/tjdevries/educationalsp) creating some helper functions for the RPC:

```go
// rpc/rpc.go
package rpc

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
)

func EncodeMessage(msg any) string {
	content, err := json.Marshal(msg)
	if err != nil {
		panic(err)
	}

	return fmt.Sprintf("Content-Length: %d\r\n\r\n%s", len(content), content)
}

type BaseMessage struct {
	Method string `json:"method"`
}

func DecodeMessage(msg []byte) (string, []byte, error) {
	header, content, found := bytes.Cut(msg, []byte{'\r', '\n', '\r', '\n'})
	if !found {
		return "", nil, errors.New("Did not find separator")
	}

	// Content-Length: <number>
	contentLengthBytes := header[len("Content-Length: "):]
	contentLength, err := strconv.Atoi(string(contentLengthBytes))
	if err != nil {
		return "", nil, err
	}

	var baseMessage BaseMessage
	if err := json.Unmarshal(content[:contentLength], &baseMessage); err != nil {
		return "", nil, err
	}

	return baseMessage.Method, content[:contentLength], nil
}

// type SplitFunc func(data []byte, atEOF bool) (advance int, token []byte, err error)
func Split(data []byte, _ bool) (advance int, token []byte, err error) {
	header, content, found := bytes.Cut(data, []byte{'\r', '\n', '\r', '\n'})
	if !found {
		return 0, nil, nil
	}

	// Content-Length: <number>
	contentLengthBytes := header[len("Content-Length: "):]
	contentLength, err := strconv.Atoi(string(contentLengthBytes))
	if err != nil {
		return 0, nil, err
	}

	if len(content) < contentLength {
		return 0, nil, nil
	}

	totalLength := len(header) + 4 + contentLength
	return totalLength, data[:totalLength], nil
}
```

```go
// main.go
package main

import (
	"bufio"
	"chesslsp/analysis"
	"chesslsp/lsp"
	"chesslsp/rpc"
	"encoding/json"
	"io"
	"log"
	"os"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(rpc.Split)
	w := os.Stdout
	state := analysis.NewState()

	for scanner.Scan() {
		msg := scanner.Bytes()
		method, contents, err := rpc.DecodeMessage(msg)
		if err != nil {
			log.Printf("Error decoding message: %s", err)
		}

		handleMessage(w, &state, method, contents)
	}
}

func handleMessage(w io.Writer, state *analysis.State, method string, contents []byte) {
	switch method {
	case "initialize":
		var request lsp.InitializeRequest
		if err := json.Unmarshal(contents, &request); err != nil {
			return
		}
		msg := lsp.NewInitializeResponse(request.ID)
		writeResponse(w, msg)
	}
}

func writeResponse(w io.Writer, msg any) {
	reply := rpc.EncodeMessage(msg)
	w.Write([]byte(reply))
}
```

The `main.go` code has been truncated to only show the initialize event, but I left in the bits of it (i.e. the `state` parameter of the `handleMessage` function that won't become clear just yet).
If you don't fully understand the code in `rpc.go`, I recommend watching the beginning portion of [TJ's video about the LSP spec](https://youtu.be/YsdlcQoHqPY?si=Sq9mlljv4PgBLpMI).
The real meat of this, however, comes in the analysis portion, as that's where everything actually happens. Before we look at that though, let's look at some of the implementations for the actual Language Server Protocol's JSON messages.

```go
// lsp/message.go
package lsp

type Request struct {
	RPC    string `json:"jsonrpc"`
	ID     int    `json:"id"`
	Method string `json:"method"`
}

type Response struct {
	RPC string `json:"jsonrpc"`
	ID  int    `json:"id,omitempty"`
}

type Notification struct {
	RPC    string `json:"jsonrpc"`
	Method string `json:"method"`
}
```

These are the basic structures for the types of messages, an example of which is the `DidOpenTextDocumentNotification`:

```go
type DidOpenTextDocumentNotification struct {
	Notification
	Params DidOpenTextDocumentParams `json:"params"`
}
```

Since Go doesn't have traditional inheritance, the `Notification` is just passed as a field in this struct.
The `Params` are then a type of another struct `DidOpenTextDocumentParams`:

```go
type DidOpenTextDocumentParams struct {
	TextDocument TextDocumentItem `json:"textDocument"`
}
```

The `TextDocumentItem` struct is what describes the actual file:

```go
type TextDocumentItem struct {
	URI        string `json:"uri"`
	LanguageID string `json:"languageID"`
	Version    int    `json:"version"`
	Text       string `json:"text"`
}
```

There are other similar structs that are used for other events, but this `Notification` is sent when a file is, shocker, opened.
As an LSP is expanded you can add more and more of these. The most important `Request` and `Response`, however, are the ones for the initialize event. These define what both the client and server are capable of. The `IntializeResponse` can be viewed here:

```go
type InitializeResponse struct {
	Response
	Result InitializeResult `json:"result"`
}
type InitializeResult struct {
	Capabilities ServerCapabilities `json:"capabilities"`
	ServerInfo   ServerInfo         `json:"serverInfo"`
}
```

When the response is given, we give the client these `ServerCapabilities`:

```go
Capabilities:
ServerCapabilities{
	TextDocumentSync:   2,
	CompletionProvider: map[string]any{},
}
```

### Analysis

When actually doing the analysis I went through three stages:

1. I will use someone's existing PGN parser
2. I'm having some trouble making use of these existing parsers, I'm going to design one myself
3. Man, just writing that lexer was a lot, I should try someone else's parser again.
   The one that stuck was one from 5 years ago [by malbrecht](https://github.com/malbrecht/chess), but there are multiple others that exist, and if I continue working on this, I'll probably go back to building my own as I require more customizability. For now though, this parser works out just fine.
   The two features I wanted for this were diagnostics and completions, and this parser (obviously) returns errors if it can't parse the PGN, and is part of a larger package that allows for looking up legal moves from a position.
   The actual analysis tool runs by having a `State` struct that stores the text documents (in this case just the one) and a database of PGNs from the parser (in this case just the one). There are then some functions that are called every time an event happens, like opening a document, updating a document, or asking for completions. I won't put any actual code here, but I'll run you through the basic order in which things happen when running the LSP in the editor.
4. The Initialize Request is sent, the server responds telling info about the server and its capabilities.
5. The `textDocument/didOpen` notification is sent, and the server loads the text of the document into the state of the analysis tool. This also sends back any diagnostic information the parser returns.
6. If the user makes any changes to the PGN, the `textDocument/didChange` notification is sent, and the server loads the text of the document in the state changes to reflect these changes. This also updates the diagnostic information.
7. Presumably, these changes cause a completion request to be sent, and the server looks through the legal moves at the position at the cursor in the file, and returns them as a list of completion items.

## Conclusion

Hopefully this was a cool look into what the LSP can do for you, and why it's such a cool technology. I didn't go into a whole lot of detail here, but if you want to take a look at the code for this, it's all on [GitHub](https://github.com/sammyshear/chesslsp). Feel free to make issues or pull requests if you want, as there are definitely problems, I just haven't found them yet.
