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

module.exports = {

	insertData(userAddSql_params){
		console.log('insert init...');
		
		var userAddSql = 'insert into text_rentalData (`url`,`title`,`img`,`rent`,`payStyle`,`rentStyle`,`floor`,`roomType`,'+
						 '`area`,`decorate`,`village`,`bigArea`,`smallArea`,`desc`,`lat`,`lng`,`updateTime`)'+
						 ' values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		connection.query(userAddSql,userAddSql_params,function(err,result){
			if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
			}

			console.log('----------------INSERT----------------');
			console.log('INSERT ID:', result);
			console.log('--------------------------------------');
		})
	},

	closeConnect(){
		connection.end();
		console.log('close success!');
	}

}

