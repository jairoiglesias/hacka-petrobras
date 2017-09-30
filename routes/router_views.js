

module.exports = function(app) {

  app.get('/teste', (req, res) => {
    res.render('teste')
  })

  app.get('/generate_qrcode/:id', (req, res) => {

    var id = req.params.id

    var QRCode = require('qrcode')
    
    QRCode.toDataURL(id, function (err, url) {
      console.log('QRCODE processado com sucesso')
      res.send(url)
    })

  })

  app.get('/pedidos/consulta', (req, res) => {

    var db = require('./../libs/connectdb.js')()
    
    var Pedidos = db.model('Pedidos')

    Pedidos.find({}, function(err, docs){
      if(err){
          throw err
      }

      res.send(docs);
      console.log(docs[0].items[0])
      
    })

  })

  // ### Efetua o cadastro de um novo pedido no posto devolvendo a imagem do QRCODE em Base64

  app.get('/pedidos/cadastro', (req, res) => {

    var data_cadastro = req.query.data_cadastro;
    var nome_cliente = req.query.nome_cliente;

    var db = require('./../libs/connectdb.js')()
    
    var Pedidos = db.model('Pedidos')

    novoPedido = new Pedidos({
      data_cadastro: data_cadastro,
      nome_cliente : nome_cliente
    })

    novoPedido.save(function(err, results){
      if(err) throw err

      console.log('cadastrado com sucesso')

      // Inicia a geração da imagem QRCODE

      var id = String(results._id)
      console.log(id)

      var QRCode = require('qrcode')
      
      QRCode.toDataURL(id, function (err, url) {
        console.log('QRCODE processado com sucesso')

        console.log(url)

        Pedidos.findOneAndUpdate({_id : results._id}, {'image_qrcode' : url}, function(err, docs){
          if(err){
            throw err
          }

          res.send(id)

        })

      })

    })

  })

  app.get('/pedidos/:id', (req, res) => {

    var id = req.params.id;

    var db = require('./../libs/connectdb.js')()
    
    var Pedidos = db.model('Pedidos')

    Pedidos.findOne({_id : id}, function(err, docs){
      if(err){
          throw err
      }

      res.send(docs);
      console.log(docs)
      
    })

  })

}