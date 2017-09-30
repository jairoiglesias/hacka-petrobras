

module.exports = function(app) {

  app.get('/dashboard_control', (req, res) => {
    res.render('dashboard_control')
  })

  app.get('/login', (req, res) => {
    res.render('login')
  })

}