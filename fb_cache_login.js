const fs = require("fs");
const login = require("facebook-chat-api");

var credentials = {email: process.env.FB_EMAIL, password: process.env.FB_PASSWORD};

login({appState: JSON.parse(fs.readFileSync(__dirname + '/appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);
    fs.writeFileSync(__dirname + '/appstate.json', JSON.stringify(api.getAppState()));
});