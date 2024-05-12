const http = require('http')
const routes = require('./routes')

const server = http.createServer((req, res) => {
  const { method, url } = req
  const route = routes.find((r) => r.method === method && r.path === url)

  if (route) {
    route.handler(req, res)
  } else {
    res.statusCode = 404
    res.end('Not found')
  }
})

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
