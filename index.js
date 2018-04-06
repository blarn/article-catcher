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
var pool = new pg.Pool(config);

//var query = "INSERT INTO urls(url, name, title) VALUES('https://www.theatlantic.com/science/archive/2018/04/the-scientific-paper-is-obsolete/556676/','Anna','The Scientific Paper Is Obsolete');"

var url_val = "https://www.theatlantic.com/politics/archive/2018/04/why-big-business-isnt-defending-amazon-against-trump/557264/"
var title_val = "Why Big Business Isn''t Defending Amazon Against Trump"
var name_val = "Anna"

var query = "INSERT INTO urls(url, name, title) VALUES(\'" 
	+ url_val + "\',\'" + name_val + "\',\'" + title_val + "\');";

pool.query(query, (err, res) => {
  console.log(err,res);
  pool.end();
});