

var rp = require('request-promise').defaults({ simple: false })
var cheerio = require('cheerio')

var getPriceInBuscape = function(beerName){

        return new Promise(function(resolve, reject){

        var url = 'http://www.buscape.com.br/search/' + beerName

        console.log(url)

        var  requestOptions = {
            uri : url,
            resolveWithFullResponse : true,
            timeout: 120000
        }

        rp(requestOptions).then(function(response){

            var body = response.body
            var $ = cheerio.load(body)

            // console.log(body)
            // process.exit()

            // var price = $('.bui-product__container').text()
            // console.log(price)

            // process.exit()
            // resolve(price)

            // console.log()

        })

    })
}

// Recupera preco de uma breja no site do Extra

var getPriceInExtra = function(beerName){

    return new Promise(function(resolve, reject){

        var  requestOptions = {
            uri : 'http://buscando.extra.com.br',
            resolveWithFullResponse : true,
            qs : {
                'strBusca' : beerName,
                'Filtro' : ''
            },
            timeout: 120000
        }

        rp(requestOptions).then(function(response){

            var body = response.body
            var $ = cheerio.load(body)

            var results = $('a.link.url')
            var totalBeers = results.length

            console.log(totalBeers)

            $(results).each(function(index, value){

                var href = $(value).attr('href')
                
                var requestOptions = {
                    uri: href,
                    resolveWithFullResponse : true,
                    timeout: 120000
                }

                rp(requestOptions).then(function(response){

                    var body = response.body
                    var $ = cheerio.load(body)

                    var price = $('.sale.price').last().text()

                    // var marketPrice = {
                    //     market: 'Extra',
                    //     price: price
                    // }
                    // resolve(marketPrice)
                    resolve(price)

                })

            })


        })

    })
}

// Recupera dados de uma breja no site www.brejas.com
var getBeersByName = function(beerName){

    var beers = []

    return new Promise(function(resolve, reject){

        var requestOptions = {
            uri : 'http://www.brejas.com.br/busca/resultados-busca',
            resolveWithFullResponse : true,
            qs: {
                keywords: beerName
            },
            timeout: 120000
        }

        rp(requestOptions).then(function(response){

            var body = response.body
            var $ = cheerio.load(body)

            var results = $('div.jr-listing-outer.jrListItem.jrShadowBox')
            var totalBeers = results.length

            console.log('Total de bebidas encontradas : ' + totalBeers)

            $(results).each(function(index, value){
                
                // Recupera o titulo e o detalhe
                var title = $(value).find('div.jrContentTitle').find('a').eq(0).text().trim()
                var url_detalhe = $(value).find('div.jrContentTitle').find('a').eq(0).attr('href')

                // Recupera os detalhes da bebida atual
                var  requestOptions = {
                    url: 'http://www.brejas.com.br/' + url_detalhe,
                    resolveWithFullResponse : true,
                    timeout: 120000
                }

                rp(requestOptions).then(function(response){

                    var body = response.body
                    var $ = cheerio.load(body)

                    var cervejaria = $('div.jrFieldRow.jrCervejaria').find('.jrFieldValue').text()
                    var grupo = $('div.jrFieldRow.jrGrupo').find('.jrFieldValue').text()
                    var estilo = $('div.jrFieldRow.jrEstilo').find('.jrFieldValue').text()
                    var ingredientes = $('div.jrFieldRow.jrIngredientes').find('.jrFieldValue').text()
                    var sazonal = $('div.jrFieldRow.jrSazonal').find('.jrFieldValue').text()
                    var alcool = $('div.jrFieldRow.jrAlcool').find('.jrFieldValue').text()
                    var descricao = $('div.jrListingFulltext').text()
                    var imagem = $('div.jrListingMainImage').find('a').eq(0).attr('href')

                    getPriceInExtra(title).then(function(price){

                        // Cria objeto JSON do beer
                        var beer = {
                            title : title,
                            url_detalhe : url_detalhe,
                            detalhes: {
                                cervejaria: cervejaria,
                                grupo: grupo,
                                estilo: estilo,
                                ingredientes : ingredientes,
                                sazonal : sazonal,
                                alcool: alcool,
                                descricao:descricao,
                                imagem: imagem
                            },
                            mediumPrice: price
                        }

                        beers.push(beer)

                        if(totalBeers == beers.length){
                            console.log(beers)
                            resolve(beers)
                        }

                    })
                     
                })
                

            })

        })

    })

}

// getPriceInExtra('brahma')
// getPriceInBuscape('skol')
// getBeersByName('brahma')

module.exports = {
    getBeersByName : getBeersByName
}