module.exports = function() {
	this.get_database_url = function(callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://api.heroku.com/apps/heyo-heyo-lil-mayo/config-vars", true);
		xhr.onload = function (e) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var result = JSON.parse(xhr.responseText).text[0]
					callback(result)
				} else {
					console.error(xhr.statusText);
				}
			}
		};
		xhr.onerror = function (e) {
			console.error(xhr.statusText);
		};
		xhr.send(null);	
	}
}