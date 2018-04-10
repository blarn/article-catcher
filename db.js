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

const pool = new pg.Pool(config);

module.exports = function() {
	this.add_url = function(url, name, title, timestamp) {
		//const pool = new pg.Pool(config);
		pool.query("INSERT INTO urls(url, name, title, time) VALUES($1,$2,$3,to_timestamp($4));", [url, name, title, timestamp], (err, res) => {
			if(err) return console.error(err);
			//pool.end();
		});
	},

	this.get_urls = function(callback) {
		//const pool = new pg.Pool(config);
		pool.query('SELECT url, name, title, time FROM urls;', (err, res) => {
			if(err) return callback(err)
			//console.log(res.rows)
			callback(null, res.rows)
			//pool.end();
		});
	}
};