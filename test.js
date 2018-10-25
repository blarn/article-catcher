require(__dirname + '/db_url.js')();
get_database_url((res) => {
	if(res) {
		console.log(res)
	}
})