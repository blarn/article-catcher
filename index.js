var express = require('express');
var path = require('path');
require(__dirname + '/db.js')();

var app = express();
var exphbs = require('express-handlebars'); 
app.engine('handlebars', 
	exphbs({defaultLayout: 'main'})); app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 5000);

var options = { 
	dotfiles: 'ignore', etag: false,
	extensions: ['htm', 'html'],
	index: false
};

app.use(express.static(path.join(__dirname, 'public') , options));
app.use(express.static('views/images')); 

app.get('/', function(req, res)
{
	get_db('urls',(err, rows) => {
		if(err) return console.error(err);
		res.render('url_list', {urls: rows.reverse()});
	});
});

app.get('/stickos', function(req, res)
{
	get_db('stickers',(err, rows) => {
		if(err) return console.error(err);
	
		query('SELECT url, count FROM stickers ORDER BY time DESC;', (err, res1) => {
			if(err) return console.error(err);

			res.render('stickos', {stickers_by_count: rows.slice(0,5), stickers_by_time: res1.rows});

		});
	});
});

app.use(function(req,res) {
	res.status(404);
	var num = Math.floor(Math.random() * 8) + 1;
	res.render('404', {layout: '404_layout', num:num});
});

app.listen(app.get('port'),  function () {
	console.log('started on http://localhost:' + app.get('port'));
});