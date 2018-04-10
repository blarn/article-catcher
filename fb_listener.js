const fs = require("fs");
const login = require("facebook-chat-api");
const urlMetadata = require('url-metadata');
require(__dirname + '/db.js')();

var urlRE= new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\\s]{2,}|www\.[a-zA-Z0-9]\.[^\\s]{2,})",'g');

var id_nums = {
	Brad:  100001935746541,
	Anna:  100000798878012
};
var id_names = {
	100001935746541: "Brad",
	100000798878012: "Anna"
}

var tID = id_nums[process.env.THREAD_ID || "Anna"];
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
					var name = id_names[message.senderID]
					if(name == null) name = "unknown";
					urlMetadata(url).then(
						function (metadata) {
							if(metadata["og:type"]=="article") {
								var title = metadata['og:title'];
							} else {
								var title = metadata.title;
							}
							add_url(url, name, title)
						},
						function (err) {
							console.log(err)
							add_url(url, name, url)
						});
				}
			}
		}
	});
});