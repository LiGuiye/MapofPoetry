var express = require('express');
var router = express.Router();


// const { Pool, Client } = require('pg')
// const connectionString = 'postgres://postgres:313616@localhost:5432/c584'
// 
// const client = new Client();
// client.connect();
// 
// const query = {
//   text: 'SELECT * FROM c584_poem WHERE poemid = $1',
//   values:['1'],
// }
// 
// // callback
// client.query(query, (err, res) => {
//   if (err) {
//     console.log(err.stack)
//   } else {
//     console.log(res.rows[0])
//   }
// });
// 
var pg = require('pg');

//数据库配置
var conString = "postgres://postgres:313616@localhost/c584"; //tcp://用户名：密码@localhost/数据库名
var client = new pg.Client(conString);

//数据库连接
function pgConnect(){
	client.connect(function(err) {
		if (err) {
			return console.error('could not connect to postgres', err);
		}
		client.query('SELECT NOW() AS "theTime"', function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log("数据库连接成功...");
		});
	});
}
pgConnect();

router.get('/search', function(req, res, next) {
	//使用/sindex?id=1传值（get方式），Post方式就是req.body.id（不受容量限制）
	var value = req.query.id;
	var query = 'SELECT * FROM c584_poem WHERE poemid = '+value;
	// callback
	client.query(query, (err, data) => {
	  if (err) {
	    console.log(err.stack)
	  } else {
	    console.log(data.rows[0]);
	  }
	});
});
module.exports = router;
