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
		pool.query("INSERT INTO urls(url, name, title, time) VALUES($1,$2,$3,to_timestamp($4));", [url, name, title, (timestamp/1e3)], (err, res) => {
			if(err) return console.error(err);
		});
	},

	this.get_db = function(db, callback) {
		switch(db) {
			case 'urls':
				var query = 'SELECT url, name, title, time FROM urls ORDER BY time;'
				break;
			case 'stickers':
				var query = 'SELECT url, count FROM stickers ORDER BY count DESC, time DESC;'
				break;
			default:
				callback(null, null)
		}
		pool.query(query, (err, res) => {
			if(err) return callback(err)
			callback(null, res.rows)
		});
	},

	this.upsert_sticker = function(id, url, timestamp) {
		pool.query('SELECT * FROM stickers WHERE id=$1', [id], (err, res) => {
			if(err) return console.error(err);
			if(res.rows.length == 0) {
				var query = 'INSERT INTO stickers(id, url, count, time) VALUES($1,$2,1,to_timestamp($3));'
				var params =  [id, url, timestamp]
			} else {
				var query = 'UPDATE stickers SET count=count+1, time=to_timestamp($2) WHERE id=$1;'
				var params =  [id, timestamp]
			}
			pool.query(query, params, (err, res) => {
				if(err) return console.error(err);
			});
		});
	}
};