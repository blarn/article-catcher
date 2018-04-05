const pg = require('pg');
const url = require('url')

const params = url.parse(process.env.DATABASE_URL);
if(params.auth == null) {
	console.log("running locally")
	//running locally
	var pool = new pg.Pool()
} else {
	console.log("using database url")
	//heroku run with DATABASE_URL
	const auth = params.auth.split(':');

	const config = {
	  user: auth[0],
	  password: auth[1],
	  host: params.hostname,
	  port: params.port,
	  database: params.pathname.split('/')[1],
	  ssl: true
	};

	var pool = new pg.Pool(config);
}

pool.query('UPDATE users SET firstName=\'Brian\', lastName=\'Pynkley\' WHERE id=2;', (err, res) => {
  console.log(err,res);
  pool.end();
});

/*
pool.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  pool.end();
});
*/