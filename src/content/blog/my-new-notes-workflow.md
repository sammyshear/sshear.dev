---
title: My New Notes Workflow
publishedTime: 2024-11-11
---

I recently made a big change in my life by starting to type up most of my notes instead of just some of them, with the majority on paper. In the past I was, shall we say, not against typing up notes, but certainly averse to it. I followed the conventional idea that writing it helped you remember better than typing it. The problem is I can type much faster than I can write, and I can certainly read much better what I've typed than what I've written. Eventually I had had too much of being unable to read something I'd jotted down too quickly, and decided I should try moving over almost entirely to the computer. I'm already spending a great deal of time in front of the computer anyway, why not simplify things?

<!--toc:start-->

- [The Problem](#the-problem)
- [The Solution](#the-solution)
    - [obsidian.nvim](#obsidiannvim)
        - [Sidebar: Neorg](#sidebar-neorg)
    - [How is this workflow more than just `obsidian.nvim`?](#how-is-this-workflow-more-than-just-obsidiannvim)
    - [The `rsync.nvim` Part](#the-rsyncnvim-part)
    - [The SSH Server](#the-ssh-server)
    - [The Final Part](#the-final-part)
- [Bonus: Pandoc and Markdown](#bonus-pandoc-and-markdown)
    <!--toc:end-->

## The Problem

The problem is that I have never found a way I really like to write notes on the computer. I've tried [Obsidian](https://obsidian.md/), [Joplin](https://joplinapp.org/), and a few others, but each time I just couldn't get accustomed to the systems. It seemed much easier to take something I already know and use and apply it to the problem. In this case I chose Neovim, because I spend a fair bit of time in it already, and often in other terminal apps as well (it's worth mentioning Joplin has a pretty good terminal app that lets you edit in your preferred editor, but I preferred an inbuilt solution).

## The Solution

There are a few plugins that are famous for the way they expand Neovim to be a formidable note-taking tool, and at first I wasn't sure how to choose. Since, however, I already had some experience with Obsidian and liked the general organizational style of that system, I decided to go for something along those lines. I'm sure most of you that are familiar with Obsidian-style note-taking in Neovim would now say, "well then, you'll be using `obsidian.nvim`." And you'd be right, except it took me a little while to get there because at first I wanted to try a solution that was more, shall we say, simple. I didn't want to introduce any complexities I didn't have to, and something about having the Obsidian frontmatter and linking between notes was almost antithetical to the simplicity I was trying to achieve. My first attempt, therefore, was with a plugin called [`note.nvim`](https://github.com/gsuuon/note.nvim/). At first I liked this, but eventually decided I preferred editing in markdown instead of highlighted plaintext, and that convinced me to switch to `obsidian.nvim`.

### obsidian.nvim

[`obsidian.nvim`](https://github.com/epwalsh/obsidian.nvim) is a powerful plugin that allows you to edit notes in markdown and make use of most of Obsidian's features from the comfort of Neovim. It handles the YAML frontmatter, the special inter-note links, and much more than I'm using it for. If you're interested in a note-taking tool in Neovim I do highly recommend it.

#### Sidebar: Neorg

I'm not going to go heavily into why I was against `neorg`, but I do want to point out that it exists, and that it scared me too much to even attempt to use it. The plugin is incredibly powerful, but from what I've read it really locks you into its world of organizational flow, plus it accomplishes much more organizational tasks than just note-taking, which also pushed me away because of the unneeded complexities thing. If I'm barely using what `obsidian.nvim` has to offer, I'm definitely not even scratching the surface of `neorg` if I were to use it. So it might be the greatest organizational tool some people have ever used, but I'm (probably) not going to ever be one of those people.

### How is this workflow more than just `obsidian.nvim`?

The single demand I had for this workflow to be able to access my notes from multiple devices and have them sync. If I'm working on my laptop and then get home to my desktop, I want to have the two sync up without much effort. The simple answer would be a git repository. The problem with that is I don't want a git repository. I have the basic reason for not wanting a git repository of I don't need basically any features of git except for pushing and pulling from a remote. While that may be a good enough reason for some to use git, it's not for me for one other reason. A reason that may seem silly to some, or even most, people because it is only even a consideration if I do something in the future which I do not currently know if I will do. However, I want to have the option open to me to sync to my phone, and the worst workflow I can imagine for editing the notes on my phone is editing inside of GitHub on mobile. So what is the solution? `rsync` to a remote server via ssh, then pull the changes every time I switch devices. How is this different than git? Well, admittedly not in ways that matter to most people, but to me it has two main advantages. Using [`rsync.nvim`](https://github.com/OscarCreator/rsync.nvim) I can automatically sync all the files between my current computer and the remote, and I have the option in the future of building custom tooling for my phone that would be much more unwieldy if I were relying on git. Again, will I ever actually make the custom tooling? Who knows! But the option is open to me.

So is that it, then? `obsidian.nvim` and `rsync.nvim`? I mean, pretty much, but there are a few additions I threw in there to make my life even easier.

### The `rsync.nvim` Part

I won't go into too much detail here, but the plugin is a good way of using `rsync` without having to write any commands yourself. With a simple config file, you can sync your notes with any remote ssh server.

```toml

remote_path = "notes@notes:/config/notes/"

ignorefile_paths = [".nvim/rsync.toml"]

```

This assumes you have a remote ssh server set up with a user called `notes` and a directory called `/config/notes/`, and that you have the server already authenticated via ssh keys in your local ssh config.

### The SSH Server

I'm just running a docker container that serves as an ssh server for this, there's really nothing special about it.

### The Final Part

The final part is those goodies I mentioned earlier. I have a few custom keybindings set for `obsidian.nvim`, but the main thing is that I have an `OpenNotebook` command in my Neovim config that opens a file called `Notebook.md` in the "vault" which basically serves as a table of contents with links to each of the other notes neatly organized.

## Bonus: Pandoc and Markdown

If you're like me and want to convert your notes from their markdown format to PDFs, this is a great bonus. `pandoc` is a great tool for converting between the two formats via LaTeX, and there's a convenient Neovim plugin to help you out with automating it: [`md-pdf.nvim`](https://github.com/arminveres/md-pdf.nvim). This plugin is pretty self-explanatory, but I'll quickly run down how I use it. Because `pandoc` has the option of using frontmatter to change options, but `obsidian.nvim` very handily manages the frontmatter of your files, and these two don't play too nicely together. There are therefore two options: Disable frontmatter support in `obsidian.nvim`, or outsource the `pandoc` frontmatter to a different file. Because I like the managed frontmatter, I chose the latter. Although this caused a slight hiccup because I didn't see a way to override the `pandoc` command used by the plugin to include the frontmatter. Luckily for me, the only thing I was doing in the frontmatter was adding additional LaTeX headers, and there's a very simple alternative: Just include the headers with the `-H` argument, which you can add to the command by adding it in the plugin's config. Eventually I ended up with this:

```lua
-- lazy.nvim Plugins File
{
    "arminveres/md-pdf.nvim",
    branch = "main", -- you can assume that main is somewhat stable until releases will be made
    lazy = true,
    keys = {
      {
        "<leader>o,",
        function()
          require("md-pdf").convert_md_to_pdf()
        end,
        desc = "Markdown preview",
      },
    },
    opts = {
      toc = false,
      pandoc_user_args = {
        "-H" .. vim.fn.expand("~") .. "/Documents/notes/pandoc-header.tex",
        "--pdf-engine=lualatex",
      },
    },
  }
```

```tex
% pandoc-header.tex
% Pandoc header for PDF output with IPA symbols and Fancy Header
\usepackage{fontspec}
\usepackage{fancyhdr}
\pagestyle{fancy}
\setmainfont{Doulos SIL}
\fancyhead[L]{Sammy Shear}

```

These two setting changes allowed me to convert any of my notes to PDFs with the keybinding `<leader>o,`.
