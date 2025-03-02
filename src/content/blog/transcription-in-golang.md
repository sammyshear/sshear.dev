---
title: "Implementing a Transcription Key in Golang with Regex"
publishedTime: 2025-03-02
---

<!-- markdownlint-disable -->

I have been wanting to do something like this for going on 5 years now, but I took several wrong steps along the way. Before I explain what those missteps were, though, I should probably explain what this project even is. The first part of the equation is the [Language and Culture Atlas of Ashkenazic Jewry](https://guides.library.columbia.edu/c.php?g=730523&p=5319433) housed at Columbia. This is a huge corpus of interviews conducted with native Yiddish speakers from pretty much all regions in which the language was spoken. The main potential barrier to using it for research, however, is the fact that it uses its own transcription system, instead of a standard like the International Phonetic Alphabet (IPA). This, while probably not something that would stop most researchers, is something that can be remedied by transcribing it from their system to the IPA, which they provide a very helpful key for on their website. The question then becomes, what is the best way of transcribing the data into the IPA?

<!--toc:start-->

- [My First Attempt](#my-first-attempt)
- [My Second Attempt](#my-second-attempt)
- [The Third Attempt](#the-third-attempt)
    - [The New System](#the-new-system)
        - [Example of the Replacement Logic](#example-of-the-replacement-logic)
    - [Bonus](#bonus)
- [The End and Final Notes](#the-end-and-final-notes)
  <!--toc:end-->

## My First Attempt

When I first looked at this problem, I may have made the scope too big, and initially the goal was to OCR all of the data and transcribe it en masse. This would work well, if the OCRing was efficient and correct, which became my main problem. Using tesseract-ocr, I started with the printouts of the typed data, the handwritten sheets would have to come later. The problem quickly presented itself that if I wanted to OCR these accurately, let alone the handwritten sheets, I would need to spend a lot of time tweaking, and I was at this point very unfamiliar with OCR technologies, so this prospect seemed very daunting. This eventually led to me giving up on this first iteration of the project until a few months ago.

## My Second Attempt

The second attempt I made was largely the same as the first attempt, I would OCR the sheets, feed them through some text processing software I wrote, and when it was finished, I would have a complete IPA version of the data. The problem was then largely the same as last time. I spent a good amount of time tweaking the imaging settings, getting almost the right result a bunch of times, but almost isn't so good when you're working with data people will be using for actual research. This led me to my third (or second, really) idea for what to do.

Although more of a stopgap solution, I decided to simply write a small web app that took manual input and processed it into IPA.

## The Third Attempt

While the other two attempts had been made in Python, I much prefer writing my web backends in Golang, so even though I will have to redo the entire logic in Python if I want to use it for a third OCR-based attempt, I chose to leave that as a problem for future me and use Go. This started out rather simplistically: I chose to use Datastar for the frontend, mostly because I had never used it and I thought it would be good practice if I wanted to use it in the future for something more complicated. The original system was a basic switch statement that fell apart rather quickly because the transcription key was not one character to one character in every case. This led me to regular expressions, which I have generally considered the bane of my existence, and this project did not do a great job convincing me otherwise.

### The New System

The system has a few parts to it, but is generally pretty simple:

1. A `RegexpKey` structure that contains both a pointer to a `regexp.Regexp` and a string for its name. This name didn't end up being totally necessary for the transcription component, but became useful later for a bonus addition to the system.
2. A basic `map` that replaces some of the simple characters with their IPA counterparts.
3. A quick setting of the input to lowercase.
4. A bunch of base regular expressions that include a regex group and a set of characters: i.e. `([aeiouəɪʌ])` for the vowels.
    - This system allows me to arbitrarily replace or add a diacritic to whatever character is captured by the regex.
5. A slice of those `RegexpKey` structs from before to have the order of the replacing remain fixed.
6. A map of those same `RegexpKey` structs and what they should be replaced with.
7. Some for loops that iterate over the slices and actually run the operations.

#### Example of the Replacement Logic

I'll show the vowels map and for loop so you can get an idea of how this should work.

```go
var vowelsMap = map[string]string{
	vowelKeys[0].name: "%c\u0306",
	vowelKeys[1].name: "%c\u0303",
	vowelKeys[2].name: "%c\u031E",
	vowelKeys[3].name: "%c\u031D",
	vowelKeys[4].name: "%c\u0320",
	vowelKeys[5].name: "%c\u031F",
	vowelKeys[6].name: "%c.",
	vowelKeys[7].name: "\u02C8%c",
	vowelKeys[8].name: "\u02CC%c",
}
...
	for _, k := range vowelKeys {
		v := vowelsMap[k.name]
		o = k.ReplaceAllStringFunc(o, func(s string) string {
			r, _ := utf8.DecodeRuneInString(s)
			_, lastSize := utf8.DecodeLastRuneInString(s)
			woLastRune := s[:len(s)-lastSize]
			if c, size := utf8.DecodeLastRuneInString(woLastRune); c != r && size != 0 && c != ',' && c != '9' {
				return fmt.Sprintf(v+"%c", r, c)
			} else if c == ',' {
				woLastRune = woLastRune[:len(woLastRune)-size]
				if cr, size := utf8.DecodeLastRuneInString(woLastRune); cr != r && size != 0 {
					return fmt.Sprintf(v+"%c", r, cr)
				}
			} else if c == '9' {
				woLastRune = woLastRune[:len(woLastRune)-size]
				if cr, size := utf8.DecodeLastRuneInString(woLastRune); cr != r && size != 0 {
					return fmt.Sprintf(v+"%c", r, cr)
				}
			}
			return fmt.Sprintf(v, r)
		})
	}
```

This is a bit of a mess, and I predictably didn't leave any comments in the code, so lets go over what this does.

First we figure out what the actual vowel is, the map just stores the name of the key, so we index it with `k.name`.

Then we run a custom replacement function that decodes the first and last runes in the string, then gets the string without the last rune included. This is so that if there are more than 2 runes in the string, we can figure out the correct order of operations for transcription. The problem is that there are quite a few scenarios to cover, so we end up with a lot of checks. In the end though, we can just return the formatted string.

The same basic system is used for the consonants, with different rules of course.

### Bonus

The bonus I mentioned earlier is the addition of the notation key for the corpus. The notation was a bit trickier, but it made use of those names I mentioned earlier, but in this case they were used as the format strings. In the future I will probably refactor the transcription to work similarly because adding this notation system made me realize the maps were pretty much pointless. Anyway, here's a sample of how it works.

```go
	NON_PHONETIC_NOTATION    = "%s(?<text>[A-Za-z\\d\\s]*)(QP)"
  ...
	{regexp.MustCompile(`(?:^|[^A-Za-z\d])(\#)`), " self-corrected"},
	{regexp.MustCompile(fmt.Sprintf(NON_PHONETIC_NOTATION, "Q(S)")), "said by: %s"},
  ...
  	for _, k := range notKeys {
		o = k.ReplaceAllStringFunc(o, func(s string) string {
			ans := k.name
			if strings.HasSuffix(ans, "%s") || strings.HasSuffix(ans, "(%s)") {
				groupIndex := k.SubexpIndex("text")
				matches := k.FindStringSubmatch(o)
				return fmt.Sprintf(ans, matches[groupIndex])
			}

			return k.name
		})
	}
```

This one is pretty simple logic-wise, but there is a lot more notation to cover, so it ended up taking a while just to type it out. I will explain the logic though, as you can see there is a named group in that `NON_PHONETIC_NOTATION` constant that we go ahead and replace the `%s` with in the format string, but only if there is a `%s` in there to replace.

## The End and Final Notes

The system ended up being pretty simple in the end, but it gave me a lot of good regex practice, although I'm hoping to avoid making use of it for a while. Also as a final note, I will mention that while I've been in contact with the librarian at the LCAAJ I learned that someone at Columbia is taking on the OCRing part of this project, using a custom-trained model. This will entirely fix the issues I was having, and hopefully it leads to an easier time for people to do research using this corpus.
