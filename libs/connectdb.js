
/*
	Arquivo de conexão para o MariaDb
*/

var myArgs = process.argv.slice(2);
var port = 0;

// if(myArgs[0] == '-port'){
// 	port = myArgs[1]
// }
// else{
// 	port = '3306'
// }

// port = process.env.PORT || 3306

// console.log('Porta para o banco de dados: '+port)

module.exports = function(){

	var mongoose = require('mongoose')
	mongoose.Promise = global.Promise

	var uri = 'mongodb://heroku_68zc1kd4:i4shak80loe4avq30n20ik1ak5@ds129013.mlab.com:29013/heroku_68zc1kd4'

	var connState = mongoose.connection.readyState

	if(connState == 0){

		mongoose.connect(uri).then(function(){

			console.log('MongoDb conectado com sucesso!!!')

			// ### Registra Schemas ###
			
			// Game Datas
			var gameDatasSchema = new mongoose.Schema({
				cardNumber : String,
				slots : {titleId: String, prefab: String, ocuppied: String}
			})

			// Proxycredcards
			var proxyCredcards = new mongoose.Schema({
				proxy: String, idCartao: String
				
			})

			mongoose.model('GameDatas', gameDatasSchema)
			mongoose.model('ProxyCredcards', proxyCredcards)

		})

	}


	return mongoose.connection

}
