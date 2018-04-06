const fs = require("fs");
const login = require("facebook-chat-api");
require(__dirname + '/index.js')();

var urlRE= new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\\s]{2,}|www\.[a-zA-Z0-9]\.[^\\s]{2,})",'g');

var threadIDs = {
	Brad:  100001935746541,
	Anna:  100000798878012,
	Melly: 100001715037724
};

var tID = threadIDs[process.env.THREAD_ID];
var data = [];

login({appState: JSON.parse(fs.readFileSync(__dirname + '/appstate.json', 'utf8'))}, (err, api) => {
	if(err) return console.error(err);
	
	api.setOptions({
		selfListen: true
	});

	api.listen((err, message) => {
		if(err) return console.error(err);
		if(message.threadID == tID) {
			console.log("sender: "+message.senderID+" message: "+message.body)
			var match = (message.body).match(urlRE);
			if(match) {
				var l = match.length;
				for (var i = 0; i < l; i++) {
					var url = match[i];
					var name = "unknown"
					if(message.senderID == threadIDs.Anna) name = "Anna";
					else if(message.senderID == threadIDs.Brad) name = "Brad";

					add_url(url, name, url)
				}
			}
		}
	});
});

/*
module.exports = function() {
	this.updateHTML = function() {
		var l = data.length;
		for (var i = 0; i < l; i++) {
			var cur = data[i];
			if(cur.html_status == "missing") {
				fs.appendFile(__dirname + '/site.html', '<p><b>'+cur.author+': </b><a href=\"'+cur.url+'\" target=\"_blank\">'+cur.url+'</a></p>\n', function (err) {
					if (err) throw err;
				});
				cur.html_status = "added";
			}
		}
	}
};
*/