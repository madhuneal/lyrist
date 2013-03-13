# Lyrist

Lyrist is a simple tool that displays the lyrics of the currently-playing iTunes track on the command line.

It is OS X-only (for the moment, at least), and uses [LyricWiki][] to find lyrics.

Lyrist was born out of a desire to learn the lyrics to my favourite songs, the disinclination to open a browser every time I wanted to do so, several unsuccessful Google searches for a fuss-free app that already did this, and an evening of procrastinating on problem sets.

![Screenshot of Lyrist in action][screenshot]

The terminal is always just a keystroke away on my setup (thanks to [TotalTerminal][]), which makes Lyrist *very* convenient for me; YMMV.

## Installation

1. [Download the latest version][download] and unzip it.
2. Intall [Node][] if you don't have it on your system. You can install it from the [Node website][Node] or alternatively, if you have [Homebrew][], by running `brew install node`.
3. Open Terminal and navigate to the folder where you unzipped Lyrist's source files.
4. Run `make` (all this does is compile the AppleScript).

To easily run the script from anywhere, you can add an alias to it in your bash profile (located at `~/.bash_profile`; you can create it if it doesn't exist) like so:

	alias lyrist="(cd /PATH/TO/lyrist && ./lyrist.sh)"

## Usage

Using Lyrist is simple (which is kind of the whole point). When a song is playing (or paused) in iTunes, go to the terminal and type the name of the alias you just created above (`lyrist` in this case). Press `enter`. *Et voilà!*

NB: If you didn't create an alias, navigate to the folder where you unzipped Lyrist and run `./lyrist.sh`.

## Issues and Feedback

I'd love any feedback you have. Use the [Issues][] tab to report bugs and give suggestions.

[LyricWiki]: http://lyrics.wikia.com/Lyrics_Wiki
[TotalTerminal]: http://totalterminal.binaryage.com/
[download]: https://github.com/spinningarrow/lyrist/zipball/master
[Node]: http://nodejs.org/
[Homebrew]: http://mxcl.github.com/homebrew/
[Issues]: https://github.com/spinningarrow/lyrist/issues

[screenshot]: https://lh6.googleusercontent.com/-15X1ZgVxCDQ/UTIj_nnBF8I/AAAAAAAAAeE/YWG4Zka_OXo/s537/lyrist.png