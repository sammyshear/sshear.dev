---
title: Building the Same App 5 Times
publishedTime: 2021-08-18
---

<!--toc:start-->

-   [Originally Published on Dev.To](#originally-published-on-devto)
-   [Building the App(s)](#building-the-apps)
    -   [jQuery](#jquery)
    -   [Angular](#angular)
    -   [React](#react)
    -   [Vue](#vue)
    -   [Svelte](#svelte)
-   [Conclusion](#conclusion)
<!--toc:end-->

### Originally Published on Dev.To

This is something that I was inspired to do because of the YouTube channel Fireship, which makes great videos about web development that I highly recommend if you're interested.
Here's the original video, which includes 10 frameworks to build a todo application:
https://youtu.be/cuHDQhDhvPE

I figured I didn't want to spend forever doing this, and I mostly wanted an excuse to learn a few new frameworks, not 6 more, so I'll only be building the same app 5 times here. The app I plan to make is a simple note-taking app, where users can write whatever they want and have it save as different notes. A few of these frameworks I've already made apps like this in before, but others I have either never done this before with, or have not used at all, so those will be more of a challenge.

## Building the App(s)

### jQuery

I will be using jQuery to make the no-framework app easier on myself, but I'm still not looking forward to this one, considering the fact I'm just making things harder for myself in the first place. Anyway, I started by just making myself a basic file structure, and opened up `index.html`. The file structure, if you're curious, is this:
![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lrz5yt6gs07w9afhff8q.png)
Basically I have a stylesheet in SCSS that I will compile to CSS, and that's about it for now. The html looks like this for now, but I'll expand upon it later:

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<link rel="stylesheet" href="./css/styles.css" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<title>Notes App</title>
	</head>

	<body>
		<div class="container">
			<header>
				<h1>Notes App</h1>
			</header>
			<main>
				<div class="note">
					<form>
						<input
							required
							type="text"
							id="note-title"
							placeholder="Note Title"
						/>
						<textarea
							id="note-body"
							placeholder="Note Body"
						></textarea>
						<input
							type="submit"
							id="note-submit"
							title="Add Note"
						/>
					</form>
				</div>
			</main>
		</div>
	</body>
</html>
```

The stylesheet looks like this:

```scss
body {
	height: 100%;
	width: 100%;
	margin: 0;
}

.container {
	width: 100%;
	height: auto;
	margin: 0;
	display: flex;
	flex-direction: column;

	header {
		display: flex;
		align-items: center;

		width: 100%;
		height: 56px;
		background-color: #4e78b8;
		color: white;

		h1 {
			margin-left: 6px;
		}
	}

	main {
		margin: 10px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		grid-gap: 1rem;
		align-items: center;

		.note {
			display: flex;
			flex-direction: column;

			padding: 10px;
			background-color: #a15fbb;
			border-radius: 5px;

			form {
				display: flex;
				flex-direction: column;

				textarea {
					resize: none;
				}
			}
		}
	}
}
```

Then I compile the code with `sass scss/styles.scss:css/styles.css`, and we're ready to start coding some JavaScript. Basically all we have to do is add a new div to the DOM with a couple of children on form submit, and save to local storage. This is what I ended up with:

```javascript
let notes = [];

$(document).ready(function () {
	if (localStorage.getItem("notes"))
		notes = JSON.parse(localStorage.getItem("notes"));
	setNotes();
});

$("#note-submit").click(function (e) {
	let noteTitle = $("#note-title").val();
	let noteDesc = $("#note-body").val();
	let note = {
		title: noteTitle,
		desc: noteDesc
	};
	notes.push(note);
	console.log(notes);
	localStorage.setItem("notes", JSON.stringify(notes));
	setNotes();
});

function setNotes() {
	notes.forEach((note) => {
		$("main").prepend(`
            <div class="note">
                <h4>${note.title}</h4>
                <span>${note.desc}</span>
            </div>
        `);
	});
}
```

This is probably not the best code it could be, but it made the most sense to me this way, and I figured that for this perfect code was not going to be needed. Regardless, this was much easier than I expected it to be given prior experience, and I actually kind of like it. The one thing that will probably be different in the other apps is the notes order because I simply could not be bothered to make it so that they always added before the form but after the other notes. That being said, it probably wouldn't be that hard to do now that I'm thinking about it.

### Angular

This one is kind of silly given how much you can do with Angular, and how little we're actually doing, but contrary to the impression I might have given off previously, I actually really like Angular, I just don't love how non-modular it can be when compared to something like React. Anyway, it's time to generate the project:

```bash
$ ng new angular
```

That's literally all we have to do to start off, isn't Angular's CLI just lovely? Anyway, I'll write basically the same code for the basic app structure:

```html
<div class="container">
	<header>
		<h1>Notes App</h1>
	</header>
	<main>
		<div class="note" *ngFor="let note of [0, 1, 2, 3]">
			<h4>Note Title</h4>
			<span>Note Body</span>
		</div>
		<div class="note">
			<form>
				<input
					required
					type="text"
					#noteTitle
					placeholder="Note Title"
					ngModel
				/>
				<textarea #noteBody placeholder="Note Body" ngModel></textarea>
				<input type="submit" #noteSubmit title="Add Note" />
			</form>
		</div>
	</main>
</div>
```

This might be controversial depending on the kind of person you are, but I'm going to do all of the logic for the app in the app component itself, without any child components. This will just make it a little simpler overall, even though we really don't have to do it. Anyway, let's use basically exactly the same styling as we did before:

```scss
.container {
	width: 100%;
	height: auto;
	margin: 0;
	display: flex;
	flex-direction: column;

	header {
		display: flex;
		align-items: center;

		width: 100%;
		height: 56px;
		background-color: #4e78b8;
		color: white;

		h1 {
			margin-left: 6px;
		}
	}

	main {
		margin: 10px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		grid-gap: 1rem;
		align-items: center;

		.note {
			display: flex;
			flex-direction: column;

			padding: 10px;
			background-color: #a15fbb;
			border-radius: 5px;

			form {
				display: flex;
				flex-direction: column;

				textarea {
					resize: none;
				}
			}
		}
	}
}
```

Anyway, we can just write some similar code to what we did before:

```typescript
import { Component } from "@angular/core";

type Note = {
	title: string;
	desc: string;
};

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent {
	notes: Array<Note> = [];
	title!: string;
	body?: string;

	constructor() {
		const data = localStorage.getItem("notes");
		if (data) this.notes = JSON.parse(data);
	}

	submitForm() {
		let note: Note = {
			title: this.title,
			desc: this.body || ""
		};
		this.notes.push(note);
		localStorage.setItem("notes", JSON.stringify(this.notes));
	}
}
```

And with that we can go back into the template, and fix up the logic for the notes:

```html
<div class="container">
	<header>
		<h1>Notes App</h1>
	</header>
	<main>
		<div class="note" *ngFor="let note of notes">
			<h4>{{note.title}}</h4>
			<span>{{note.desc}}</span>
		</div>
		<div class="note">
			<form #addNoteForm="ngForm">
				<input
					required
					type="text"
					placeholder="Note Title"
					[(ngModel)]="title"
					name="Title"
				/>
				<textarea
					placeholder="Note Body"
					[(ngModel)]="body"
					name="Body"
				></textarea>
				<input
					type="submit"
					#noteSubmit
					title="Add Note"
					(click)="submitForm()"
				/>
			</form>
		</div>
	</main>
</div>
```

That's all folks!

### React

This is one that I think is probably going to be more complex than it needs to be due to the nature of React. React is designed to be more modular and lightweight than other frameworks, but in some ways it's actually more complex for smaller apps because of the way it's structured. Anyway, I started by generating my react app with my custom template `sammy-libraries`:

```bash
$ yarn create react-app react-app --template sammy-libraries
```

I had a bug which occasionally comes up where node sass (which I still use mainly because dart sass has a slow compile time for React in my experience) refuses to compile my sass code, so I just deleted node_modules and yarn.lock and ran `yarn` again, and it worked like a charm. Anyway here's what I did. I started off by making `index.scss` the same as `styles.scss` from the first app, and then in my App component I recreated the app's basic structure:

```typescript
import React, { useEffect, useState } from "react";
import NotesList from "components/NotesList";
import { NoteType } from "components/Note";
//import "scss/App.scss";

function App() {
    const [notesList, setNotesList] = useState<NoteType[]>([]);

    const [noteTitle, setNoteTitle] = useState<string>("");
    const [noteDesc, setNoteDesc] = useState<string>("");

    useEffect(() => {
        const data = localStorage.getItem("notes");
        if (data) {
            setNotesList(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notesList));
    }, [notesList])

    const addNote = (event: React.FormEvent<HTMLFormElement>) => {
        let note: NoteType = {
            title: noteTitle,
            desc: noteDesc,
        };
        setNotesList([...notesList, note]);
        event.preventDefault();
    };

    const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNoteTitle(event.currentTarget.value);
    };

    const changeDesc = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNoteDesc(event.currentTarget.value);
    };

    return (
        <div className="container">
            <header>
                <h1>Notes App</h1>
            </header>
            <NotesList addNote={addNote} changeTitle={changeTitle} changeDesc={changeDesc} notes={notesList} />
        </div>
    );
}

export default App;
```

This doesn't do anything yet, so let's add in the other components:
I made 3 in a separate components folder, and then I filled them in accordingly:
`NotesList.tsx`:

```typescript
import React from "react";
import AddNote from "components/AddNote";
import Note, { NoteType } from "components/Note";

type NotesListProps = {
    notes: NoteType[];
    addNote: (event: React.FormEvent<HTMLFormElement>) => void;
    changeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
    changeDesc: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

function NotesList({ notes, addNote, changeTitle, changeDesc }: NotesListProps) {
    return (
        <main>
            {notes.map((note) => {
                return (
                    <Note
                        note={{
                            title: note.title,
                            desc: note.desc,
                        }}
                    />
                );
            })}
            <AddNote addNote={addNote} changeTitle={changeTitle} changeDesc={changeDesc} />
        </main>
    );
}

export default NotesList;
```

`Note.tsx`:

```typescript
import React from "react";

export type NoteType = {
    title: string;
    desc: string;
}

interface NoteProps {
    note: NoteType;
}

function Note(props: NoteProps) {
    return (
        <div className="note">
            <h4>{props.note.title}</h4>
            <span>{props.note.desc}</span>
        </div>
    );
}

export default Note;
```

And `AddNote.tsx`:

```typescript
import React from "react";

interface AddNoteProps {
    changeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
    changeDesc: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    addNote: (event: React.FormEvent<HTMLFormElement>) => void;
}

function AddNote(props: AddNoteProps) {
    return(
        <div className="note">
            <form onSubmit={props.addNote}>
                <input type="text" placeholder="Note Title" onChange={props.changeTitle} />
                <textarea placeholder="Note Body" onChange={props.changeDesc}></textarea>
                <input type="submit" value="Add Note" />
            </form>
        </div>
    );
}

export default AddNote;
```

Not the most complex thing I've ever done, but it certainly feels a lot more complex than just using jQuery or Angular, at least to me anyway. I really like React, I consider it my favorite framework, I just don't know that I love using it for this kind of thing. So far if I had to choose, I'd say Angular is the cleanest of the group, JQuery is the most sensible (for this project anyway), and React is the awkward one that feels really nice to use but seems kind of pointless anyway.

### Vue

This is a framework I have used a single time, which might be blasphemous to some people, but I just haven't really seen a need to bother with it, if you can believe that. I can use both Angular and React, and that feels like it covers most of what I need to do (and the rest is usually filled in with libraries), so Vue just never seemed so useful to me. Anyway, let's make ourselves a Vue project.

```bash
$ vue ui
```

I went with basically all the defaults but with TypeScript and SCSS (with dart sass mostly so I didn't end up with broken dependencies) instead because I just really like using both of them in my projects. The only real reason I didn't use TypeScript in the first one was because I couldn't be bothered to get jQuery and TS working together, but doing that is possible if you're interested.
How did I go about making this app? Well first I deleted just about everything about the app that was auto-generated, and replaced the App code with this:

```vue
<template>
	<div class="container">
		<header>
			<h1>Notes App</h1>
		</header>
		<main>
			<Note
				v-for="(note, index) in notes"
				:key="index"
				:title="note.title"
				:body="note.body"
			/>
			<div class="note">
				<form @submit="submitForm()">
					<input
						type="text"
						placeholder="Note Title"
						v-model="title"
					/>
					<textarea placeholder="Note Body" v-model="body"></textarea>
					<input type="submit" value="Add Note" />
				</form>
			</div>
		</main>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Note from "./components/Note.vue";

type NoteType = {
	title: string;
	body: string;
};

@Component({
	components: {
		Note
	}
})
export default class App extends Vue {
	notes: Array<NoteType> = [];
	title!: string;
	body?: string;

	constructor() {
		super();
		const data = localStorage.getItem("notes");
		if (data) this.notes = JSON.parse(data);
	}

	submitForm(): void {
		let note: NoteType = {
			title: this.title,
			body: this.body || ""
		};
		this.notes.push(note);
		localStorage.setItem("notes", JSON.stringify(this.notes));
	}
}
</script>

<style lang="scss">
body {
	height: 100%;
	width: 100%;
	margin: 0;
}

.container {
	width: 100%;
	height: auto;
	margin: 0;
	display: flex;
	flex-direction: column;

	header {
		display: flex;
		align-items: center;

		width: 100%;
		height: 56px;
		background-color: #4e78b8;
		color: white;

		h1 {
			margin-left: 6px;
		}
	}

	main {
		margin: 10px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		grid-gap: 1rem;
		align-items: center;

		.note {
			display: flex;
			flex-direction: column;

			padding: 10px;
			background-color: #a15fbb;
			border-radius: 5px;

			form {
				display: flex;
				flex-direction: column;

				textarea {
					resize: none;
				}
			}
		}
	}
}
</style>
```

And then the Note component was this:

```vue
<template>
	<div class="note">
		<h4>{{ this.title }}</h4>
		<span>{{ this.body }}</span>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
	components: {}
})
export default class App extends Vue {
	@Prop() title!: string;
	@Prop() body?: string;
}
</script>
```

And that's that.

### Svelte

Here's the framework I wanted to learn, but didn't even think about touching until I was thinking about doing this. Basically I went into this knowing absolutely nothing except that Svelte gets a lot of love from web devs, but I'm probably going to continue making projects with Svelte after this, so I might be really bad at it now, but there's I chance I get better in the future.
Anyway, after about 10 minutes of trying to find a yarn create-\* CLI for Svelte that doesn't exist, I decided to just set up the project with their boilerplate as is intended. I converted the project to TypeScript because I'm some kind of addict to strongly typed languages, and I got started:
For styling I bit the bullet and stopped using SCSS, and by that I mean I couldn't be bothered to setup SCSS regardless of how easy it would be, so I just compiled it manually because it's not like I'll be editing the stylesheet too much anyway. This is the component I went with:

```svelte
<script lang="ts">
import Note from "./components/Note.svelte";

type NoteType = {
	title: string;
	body: string;
};

let notes: Array<NoteType> = [];

const data = localStorage.getItem("notes");
if (data) notes = JSON.parse(data);

let title: string = "";
let body: string = "";

function onSubmit() {
	let note: NoteType = {
		title: title,
		body: body
	};
	notes.push(note);
	localStorage.setItem("notes", JSON.stringify(notes));
}
</script>

<div class="container">
	<header>
		<h1>Notes App</h1>
	</header>
	<main>
		{#each notes as note}
			<Note title={note.title} body={note.body} />
		{/each}
		<div class="note">
			<form on:submit={onSubmit}>
				<input type="text" placeholder="Note Title" bind:value={title} />
				<textarea placeholder="Note Body" bind:value={body}></textarea>
				<input type="submit" value="Add Note" />
			</form>
		</div>
	</main>
</div>

<style>
body {
  height: 100%;
  width: 100%;
  margin: 0;
}

.container {
  width: 100%;
  height: auto;
  margin: 0;
  display: flex;
  flex-direction: column;
}
.container header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  background-color: #4e78b8;
  color: white;
}
.container header h1 {
  margin-left: 6px;
}
.container main {
  margin: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-gap: 1rem;
  align-items: center;
}
.container main .note {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #a15fbb;
  border-radius: 5px;
}
.container main .note form {
  display: flex;
  flex-direction: column;
}
.container main .note form textarea {
  resize: none;
}
</style>
```

And here is the Note component:

```svelte
<script lang="ts">
    export var title: string;
    export var body: string;
</script>

<div class="note">
    <h4>{title}</h4>
    <span>{body}</span>
</div>
```

Here's the problem, one I don't know how to solve and at this point don't want to solve, the styling only works if you paste the styles into `bundle.css`, which then resets itself whenever it live reloads. This won't be a problem on a fully built app, but it's very annoying for testing. I don't think I'm going to be fixing this anytime soon, but maybe I'll fix it eventually.

## Conclusion

Remember when I said I was going to try to build more things with Svelte? I don't know how committed to that I'm going to be because while I did enjoy a lot of the aspects of Svelte, there were just too many hiccups for me to want to use it more often. React I think was given an unfair shake by the project I was building, Angular I still think is the cleanest, Vue I think was the most fun, and jQuery was probably the best, which surprised me a lot. I think if I had to choose a framework for future projects, it would definitely depend on the project, but I can see myself using all of them again, even with the difficulties I had with Svelte. That being said I'll probably do most of my work in Angular and React, with jQuery and Vue being my next choices. I will probably give Svelte another chance, but I don't think I want to be building too many things in it regardless of whether I was unfair to it with this project or not. Anyway, I think any of these frameworks would be a great choice for a lot of use cases, and I definitely see why people like Vue now, but I can't say my opinions have changed all that much.
