const { login, authenticate } = require('./utils')

const routes = [
  {
    method: 'POST',
    path: '/login',
    handler: (req, res) => {
      login(req, res)
    },
  },
  {
    method: 'GET',
    path: '/protected',
    handler: (req, res) => {
      authenticate(req, res)
    },
  },
]

module.exports = routes
