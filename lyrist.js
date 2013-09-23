#!/usr/bin/env node

// Lyrist
// (c) 2013 Sahil Bajaj. Released under the MIT License.
//
// lyrist.js

var exec = require('child_process').exec
var request = require('request')
var cheerio = require('cheerio')
var Q = require('q')

// Get track info if it was passed in as an argument (format: '<artist
// name> - <song title>') or from iTunes if it is running
function getTrackInfo() {

	var trackInfoDeferred = Q.defer()

	// The first argument is node, the second is the script path
	if (process.argv.length > 2) {

		trackInfoDeferred.resolve(process.argv[2].split(/\s+-\s+/))
		return trackInfoDeferred.promise
	}

	// No track info passed in as argument; get artist name and song
	// title from iTunes (using AppleScript)
	exec('osascript ' + __dirname + '/lyrist.scpt', function (error, data) {

		if (error) {
			trackInfoDeferred.reject(error)
			return
		}

		// Remove newline from data, if any
		data = data.replace(/\n/, '')

		// Check that iTunes is running, that a song is playing and that
		// an artist name and song title were passed in
		if (data == 'NOT_RUNNING') {
			trackInfoDeferred.reject(new Error('iTunes is not running / no track info argument provided.\n' +
				'Play a song in iTunes or pass in an artist and song title (format: `lyrist.js \'<artist name> - <song title>\'`).'))
			return
		}

		if (data == 'STOPPED') {
			trackInfoDeferred.reject(new Error('There is no song playing in iTunes.'))
			return
		}

		// Track info found; parse artist and song title
		var trackInfo = data.split(/@(?:artist|song)=/)
		trackInfo.shift()

		if (trackInfo.length !== 2) {
			trackInfoDeferred.reject(new Error('That does not look like a valid artist and song title.'))
			return
		}

		// Full steam ahead!
		trackInfoDeferred.resolve(trackInfo)
	})

	return trackInfoDeferred.promise
}

getTrackInfo().then(function (trackInfo) {

	// Query using LyricWiki's API
	var queryUrl =
		'http://lyrics.wikia.com/api.php?artist=' + encodeURIComponent(trackInfo[0]) +
		'&song=' + encodeURIComponent(trackInfo[1]) +
		'&fmt=xml'

	request.get(queryUrl, function (error, response, body) {

		var matches

		// Get artist and song information
		matches = body.match(/<artist>(.+)<\/artist>/)
		var artist = matches && matches[1]

		matches = body.match(/<song>(.+)<\/song>/)
		var song = matches && matches[1]

		// Check if lyrics were found
		if (body.indexOf('<lyrics>Not found') !== -1) {
			process.stdout.write('No lyrics could be found for ' + song + ' by ' + artist + '.\n')
			return
		}

		// Check if song is an istrumental piece
		if (body.indexOf('<lyrics>Instrumental') !== -1) {
			process.stdout.write(song + ' by ' + artist + ' is an instrumental.\n')
			return
		}

		// Get actual URL to lyrics
		matches = body.match(/<url>(.+)<\/url>/)
		var lyricsUrl = matches && matches[1]

		if (!lyricsUrl) {
			process.stdout.write('Invalid lyrics URL.\n')
			return
		}

		// Fetch the lyrics page and scrape the actual lyrics from it
		request.get(lyricsUrl, function (error, response, body) {

			var $ = cheerio.load(body)

			// Remove extra non-lyrics text
			$lyricbox = $('.lyricbox')
			$lyricbox.find('div').remove()

			// Find first lyrics element that actually has something in
			// it, otherwise use the last element
			var i = 0
			while ($lyricbox.eq(i).text().replace(/\s+/, '') === '' && i < $lyricbox.length) {
				i++
			}

			var html = $lyricbox.eq(i).html()
			html = html.substring(0, html.indexOf('<!--'))

			// Hacky stuff because LyricWiki seems to obfuscate lyrics
			// somewhat using hex codes
			var $div = $('<div></div>')
			$div.text(html.replace(/<br>/gi, '\n'))

			process.stdout.write('\033[94m' + song + '\033[0m by \033[94m' + artist + '\033[0m\n\n')
			process.stdout.write($div.text())
		})
	})
}, function (error) {
	console.log(error.message)
	process.exit(1)
})
