---
title: I Followed a 40 year old Pascal Book (in Rust)
publishedTime: 2024-01-05
---

<!--toc:start-->

-   [What is this book?](#what-is-this-book)
-   [What will I be doing?](#what-will-i-be-doing)
-   [Part 1 (Chapter 2): Murder at the Metropolitan Club](#part-1-chapter-2-murder-at-the-metropolitan-club)
-   [Part 2 (Chapter 3): Holmes Gives a Demonstration](#part-2-chapter-3-holmes-gives-a-demonstration)
    -   [Rust](#rust)
    <!--toc:end-->

My father is a big fan of mystery novels, certainly more than I am. I enjoy a Sherlock Holmes story now and again, and I have had fun reading Agatha Christie novels, but he is and always will be a bigger fan of the genre than I. That being said, there is one mystery book I find much more interesting to me than he ever has, and that is "Elementary Pascal" by Henry Ledgard and Andrew Singer. My father will happily tell you the furthest he got in computer programming was making a 3D Cube in Basic and reading the programs for his Commodore 64 in a magazine, but almost never running them as he would have had to copy them each by hand. I, on the other hand, have much more of an interest in programming, as might be evident from the fact I am writing this blog post where I do so. When I was first learning to program as a kid, my father gave me this book that he'd had since he was a kid. He claimed to have hardly read it, but that I might be interested in it, and compared to him I certainly was. That said, I only ever read a few of the examples, as I had very little actual interest in learning Pascal. In more recent years, the book has sat on my shelf, undisturbed, waiting to once again be opened. Today was that day.

### What is this book?

This book is a way of teaching Pascal by examples written in the form of Sherlock Holmes mysteries. Each chapter is a story which teaches you core concepts of the both the Pascal language and programming in general.

### What will I be doing?

I will be, rewriting the Pascal code presented in the book as Rust mostly for fun, but also to see how programming has evolved between the points of these two languages. If there are any optimizations I notice can be made, I'll do my best to implement them, but that isn't really what I'll be focusing on with this.

## Part 1 (Chapter 2): Murder at the Metropolitan Club

If you have this book and are following along at home, you may notice this is technically Chapter 2, but given Chapter 1 is more of an introduction to the concept of a computer than anything else, I figured I'd skip to this chapter for this article.

This chapter is all about solving a murder based on clues provided to an algorithm. The basic algorithm used in the book is summed up by the pseudocode they provide:

```
1. Look at the next clue
2. If it establishes a fact then:
    record that fact
else
    dismiss the clue
3. Repeat this process until the murderer is found.
```

The clues provided are as follows:

1. Sir Raymond Jasper occupied Room 10.
2. The man occupying Room 14 had black hair.
3. Either Sir Raymond or Colonel Woodley wore a pince-nez.
4. Mr. Pope always carried a gold pocket-watch.
5. One of the suspects was seen driving a 4-wheel carriage.
6. The man with the pince-nez had brown hair.
7. Mr. Holman wore a ruby signet ring.
8. The man in Room 16 had tattered cuffs.
9. Mr. Holman occupied Room 12.
10. The man with the tattered cuffs had red hair.
11. The man in Room 12 had gray hair.
12. The man with a gold pocket watch occupied Room 14.
13. Colonel Woodley occupied a corner room.
14. The murderer had brown hair.

This is all the information we have to feed into the algorithm, but there is also a map of the rooms we can use to define what is a corner room. The map shows us that rooms 16 and 10 are corner rooms. For this chapter I will not write any code, as the chapter simply goes over the algorithm and how to create an algorithm in general. In the next chapter we get our first Pascal code, and that's what I will be rewriting.

## Part 2 (Chapter 3): Holmes Gives a Demonstration

The Pascal code is fairly interesting to me in the way it approaches the problem. Since I don't really know Pascal all too well, I can't tell you if this was simplified for the purposes of the book or if this is truly the best way to solve this problem. Regardless, I find the code we are given to be fascinating. So as to save me the trouble of transcribing all of it into this article, I will show snippets of the Pascal code with some explanations along the way, then I will show my Rust equivalents.

```pascal
const
    UNKNOWN = 0;
    RED = 1; BLACK = 2; GREY = 3; BROWN = 4;
    PINCENEZ = 1; GOLDWATCH = 2; RUBYRING = 3; TATTEREDCUFFS = 4;
    COLWOODLEY = 1; MRHOLMAN = 2; MRPOPE = 3; SIRRAYMOND = 4;
var
    SUSPECT, MURDERER: INTEGER;

    HAIR : array [COLWOODLEY .. SIRRAYMOND] of INTEGER;
    ATTIRE : array [COLWOODLEY .. SIRRAYMOND] of INTEGER;
    ROOM : array [COLWOODLEY .. SIRRAYMOND] of INTEGER;
```

The first bit of the program assigns the variables and constants that will be used globally in the program. You can probably start piecing together the implementation of the algorithm based on these declarations. There are 3 arrays that are the length of a range between `COLWOODLEY` and `SIRRAYMOND`, each of integers, while each piece of information is defined as a constant between 1 and 4, along with an `UNKNOWN` of 0. The thought process is, of course, that each person represents an index of the arrays, and as such the data of the array `ATTIRE` at that index represents whether they're wearing, say, a ruby ring or a gold watch. The same concept going for the other arrays, of course.

I probably would never have thought of this approach and would have instead defined structs and enums to do essentially the same thing, but I find this approach very sensical and almost delightfully simple.

The next bit of the program assigns all the known and unknown pieces of data in the array.

```pascal
MURDERER := UNKNOWN;
for SUSPECT := COLWOODLEY to SIRRAYMOND do begin
    HAIR[SUSPECT] := UNKNOWN;
    ATTIRE[SUSPECT] := UNKNOWN;
    ROOM[SUSPECT] := UNKNOWN
end;

ROOM[SIRRAYMOND] := 10;
ATTIRE[MRPOPE] := GOLDWATCH;
ATTIRE[MRHOLMAN] := RUBYRING;
ROOM[MRHOLMAN] := 12;
```

I don't think there's much explaining that needs to be done for that snippet. Anyway, for this next bit I won't be typing out each if statement, I'll instead show the while loop definition and a few of the if statements for assigning data, mostly the ones in which I find the syntax particularly interesting.

```pascal
SUSPECT := COLWOODLEY;

while MURDERER = UNKNOWN do begin
if (ROOM[SUSPECT] = 14) then
    HAIR[SUSPECT] := BLACK;
if (ATTIRE[SIRRAYMOND]<>UNKNOWN) and (ATTIRE[SIRRAYMOND]<>PINCENEZ) then
    ATTIRE[COLWOODLEY] := PINCENEZ
...
if (ATTIRE[SUSPECT] = PINCENEZ) then
    HAIR[SUSPECT] := BROWN;
...
if (HAIR[SUSPECT] := BROWN) then
    MURDERER := SUSPECT;
if (SUSPECT = SIRRAYMOND) then
    SUSPECT := COLWOODLEY; { -- prevents an index out of bounds }
else
    SUSPECT := SUSPECT + 1;
end;
```

As you can see from the basic structure, as long as the murderer is still unknown, it will perform an iteration where it tries to assign new information to people based on the clues, then increments (or sets back to `COLWOODLEY`) the suspect for the next iteration. Also of note, to me at least, is the not equal to operator being `<>`. At this point you've probably also noticed that the assignment operator is `:=`, much like Go, which frees up `=` to be the equal to operator. The final thing to note is that earlier when the arrays were being declared, you may have noticed the range operator is very similar to Rust, which I didn't know before starting this post, and found quite interesting.

Anyway, after this while loop is finished, it checks who the murderer is and prints it to the standard output with `WRITE`.

Overall it's a very simple program, which is refreshing for me because I have a bad habit of overengineering things, so seeing it done this way is very helpful to not do the same in my Rust solution.

### Rust

Now it's time to implement it in Rust. I will be doing a 1 for 1 transcription of the Pascal code to Rust, but in future chapters that may change.

```rust
const UNKNOWN: u8 = 0;
const RED: u8 = 1;
const PINCENEZ: u8 = 1;
const COLWOODLEY: usize = 1;
const BLACK: u8 = 2;
const GOLDWATCH: u8 = 2;
const MRHOLMAN: usize = 2;
const GREY: u8 = 3;
const RUBYRING: u8 = 3;
const MRPOPE: usize = 3;
const BROWN: u8 = 4;
const TATTEREDCUFFS: u8 = 4;
const SIRRAYMOND: usize = 4;

fn main() {
    let mut murderer = UNKNOWN;
    let mut hair: Vec<u8> = vec![UNKNOWN, UNKNOWN, UNKNOWN, UNKNOWN, UNKNOWN]; // dummy value at 0 to keep parity with Pascal
    let mut attire: Vec<u8> = vec![UNKNOWN, UNKNOWN, UNKNOWN, UNKNOWN, UNKNOWN];
    let mut room: Vec<u8> = vec![UNKNOWN, UNKNOWN, UNKNOWN, UNKNOWN, UNKNOWN];

    // establish known clues

    room[SIRRAYMOND as usize] = 10;
    attire[MRPOPE as usize] = GOLDWATCH;
    attire[MRHOLMAN as usize] = RUBYRING;
    room[MRHOLMAN as usize] = 12;

    let mut suspect = COLWOODLEY;

    while murderer == UNKNOWN {
        if room[suspect] == 14 {
            hair[suspect] = BLACK;
        }
        if attire[SIRRAYMOND] != UNKNOWN && attire[SIRRAYMOND] != PINCENEZ {
            attire[COLWOODLEY] = PINCENEZ;
        }
        if attire[COLWOODLEY] != UNKNOWN && attire[COLWOODLEY] != PINCENEZ {
            attire[SIRRAYMOND] = PINCENEZ;
        }
        if attire[suspect] == PINCENEZ {
            hair[suspect] = BROWN;
        }
        if attire[suspect] == TATTEREDCUFFS {
            hair[suspect] = RED;
        }
        if room[suspect] == 16 {
            attire[suspect] = TATTEREDCUFFS;
        }
        if room[suspect] == 12 {
            hair[suspect] = GREY;
        }
        if attire[suspect] == GOLDWATCH {
            room[suspect] = 14;
        }
        if room[suspect] == 10 && suspect != COLWOODLEY {
            room[COLWOODLEY] = 16;
        }
        if room[suspect] == 16 && suspect != COLWOODLEY {
            room[COLWOODLEY] = 10;
        }
        if hair[suspect] == BROWN {
            murderer = suspect as u8;
        }
        if suspect == SIRRAYMOND {
            suspect = COLWOODLEY;
        } else {
            suspect = suspect + 1;
        }
    }

    if suspect == COLWOODLEY {
        println!("Colonel Woodley is the murderer.");
    }
    if suspect == MRHOLMAN {
        println!("Mr. Holman is the murderer.");
    }
    if suspect == MRPOPE {
        println!("Mr. Pope is the murderer.");
    }
    if suspect == SIRRAYMOND {
        println!("Sir Raymond is the murderer.");
    }
}
```

That's about it for this chapter, and so I will end the post here. I will in all likelihood be making this a series, so if you're interested, stay tuned for post number 2 where I'll try to tackle the fourth chapter, "The Adventure of the Bathing Machine." (These first two chapters are more of a warm up for the format of the book, the following chapters will each be their own mystery).
