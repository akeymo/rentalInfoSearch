var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	port: '3306',
	database: 'rentalDatabase'
});

// 创建连接
connection.connect(function(err){
	if(err){
		console.log('[query] - :'+err);
		return;
	}

	console.log('[connection connect] succeed!');
});

module.exports = connection;
