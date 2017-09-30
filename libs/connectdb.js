
/*
	Arquivo de conexão para o MariaDb
*/

// var myArgs = process.argv.slice(2);
// var port = 0;

// if(myArgs[0] == '-port'){
// 	port = myArgs[1]
// }
// else{
// 	port = '3306'
// }

// port = process.env.PORT || 3306

// console.log('Porta para o banco de dados: '+port)

// module.exports = function(){

// 	var mysql      = require('mysql');
// 	var connection = mysql.createConnection({
// 	  host     : 'us-cdbr-iron-east-05.cleardb.net',
// 	  user     : 'b3f51670b3c491',
// 	  password : 'e6f6808f',
// 		database : 'heroku_5349392628b227f',
// 		port: port
// 	});

// 	connection.connect(function(err) {
// 		if (err) {
// 			console.error('error connecting: ' + err.stack);
// 			return;
// 		}

// 		console.log('Conexão realizada com sucesso!');

// 	});

// 	return connection
// }

// ### MODEL MONGODB ###

module.exports = function(){

	var mongoose = require('mongoose')
	mongoose.Promise = global.Promise

	var uri = 'mongodb://heroku_vg6mwhqp:kcjh3617mgakeo5234fa73ke9n@ds155634.mlab.com:55634/heroku_vg6mwhqp'
	
	var connState = mongoose.connection.readyState

	if(connState == 0){

		mongoose.connect(uri).then(function(){

			console.log('MongoDb conectado com sucesso!!!')

			// ### Registra Schemas ###

			// Pedidos
			var pedidosSchema = new mongoose.Schema({
				'data_cadastro' : String,
				'nome_cliente' : String,
				'image_qrcode' : String,
				items : [{'nome_item' : String, 'qtde' : Number}]
			})

			mongoose.model('Pedidos', pedidosSchema)

		})

	}


	return mongoose.connection

}
