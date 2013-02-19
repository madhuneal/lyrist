//console.log(process.argv)
var request = require('request')
var cheerio = require('cheerio')

process.stdin.resume();
// process.stdin.setEncoding('utf8');

process.stdin.on('data', function(data) {
	// process.stdout.write(data);
	data = (data + "").split(' - ')
	var artist = data[0]
	var song = data[1]
	request.get(encodeURI('http://lyrics.wikia.com/api.php?artist=' + artist + '&song=' + song), function (error, response, body) {
		var $ = cheerio.load(body)
		var url = $('a[title="url"]').text()

		request.get(url, function (error, response, body) {
			var $ = cheerio.load(body)
			$('.lyricbox').find('div').remove()
			// $('.lyricbox').find('.lyricsbreak').remove()
			// var lyrics = $('.lyricbox').text()
			var html = $('.lyricbox').html()
			html = html.substring(0, html.indexOf('<!--'))

			var $div = $('<div></div>')
			$div.text(html.replace(/<br>/gi, '\n'))

			process.stdout.write($div.text())
		})
	})
});
