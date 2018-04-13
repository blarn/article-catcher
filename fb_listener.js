const fs = require("fs");
const login = require("facebook-chat-api");
const urlMetadata = require('url-metadata');
require(__dirname + '/db.js')();

var urlRE= new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\\s]{2,}|www\.[a-zA-Z0-9]\.[^\\s]{2,})",'g');

login({appState: JSON.parse(fs.readFileSync(__dirname + '/appstate.json', 'utf8'))}, (err, api) => {
	if(err) return console.error(err);
	
	api.setOptions({
		selfListen: true
	});

	var id_names = {};

	var tID = process.env.THREAD_ID || api.getCurrentUserID();

	api.listen((err, message) => {
		if(err) return console.error(err);
		if(message.threadID == tID) {

			//gets names in advance (even for non-url messages)
			var id = message.senderID
			var name = "Unknown"
			if(id in id_names) {
				var name = id_names[id]
			} else {
				api.getUserInfo([id], (err, ret) => {
					if(err) return console.error(err);
					if(ret.hasOwnProperty(id) && ret[id].firstName != null) {
						name = ret[id].firstName
						id_names[id] = name;
					}
				});
			}
			console.log(name+": "+message.body)

			//URLs:
			var match = (message.body).match(urlRE);
			if(match) {
				var l = match.length;
				for (var i = 0; i < l; i++) {
					var url = match[i];
					urlMetadata(url).then(
						function (metadata) {
							if(metadata["og:type"]=="article") {
								var title = metadata['og:title'];
							} else {
								var title = metadata.title;
							}
							add_url(url, name, title, message.timestamp)
						},
						function (err) {
							console.log(err)
							add_url(url, name, null, message.timestamp)
						}
					);
				}
			}

			//Stickers:
			if(message.attachments.length==1 && message.attachments[0].type=='sticker') {
				//console.log("Sticker: "+ JSON.stringify(message.attachments[0]))
				upsert_sticker(message.attachments[0].ID, message.attachments[0].url)
			}
		}
	});
});