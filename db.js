const sql = require('mysql2')
const db = sql.createConnection({
    host : '127.0.0.1',
	port: '33065',
    user : 'root',
    password  :'secret',
    database : 'prueba_bcc'
})

db.connect(function(err){
	if(!!err) {
		console.log(err);
	} else {
		console.log('Connected..!');
	}
})

module.exports = db
