const pg = require('pg');
const url = require('url')

var config = null;
if(process.env.DATABASE_URL) {
	const params = url.parse(process.env.DATABASE_URL);
	const auth = params.auth.split(':');
	config = {
		user: auth[0],
		password: auth[1],
		host: params.hostname,
		port: params.port,
		database: params.pathname.split('/')[1],
		ssl: true
	}
}

module.exports = function() {
	//TODO title and timestamp
	this.add_url = function(url, name) {
		const pool = new pg.Pool(config);

		//var query = "INSERT INTO urls(url, name) VALUES(\'$1\',\'$2\');", [url, name]

		pool.query("INSERT INTO urls(url, name) VALUES($1,$2);", [url, name], (err, res) => {
			if(err) return console.error(err);
			pool.end();
		});
	},

	this.get_urls = function() {
		const pool = new pg.Pool(config);

		var query ='SELECT url, name FROM urls;'

		pool.query(query, (err, res) => {
			if(err) return console.error(err);
			//json(res.rows);

			//do stuff with result


			pool.end();
		});
	}
};