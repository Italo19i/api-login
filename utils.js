const crypto = require('crypto')

const users = [{ username: 'admin', password: 'password' }]
const secretKey = 'your-secret-key'

function generateToken(payload, secretKey) {
    const header = Buffer.from(JSON.stringify({ typ: 'JWT', alg: 'HS256' })).toString('base64')
    const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64')
    const signature = crypto.createHmac('sha256', secretKey).update(`${header}.${payloadString}`).digest('base64')
    return `${header}.${payloadString}.${signature}`
}

function decodeToken(token, secretKey) {
    const [header, payload, signature] = token.split('.')
    const verifiedSignature = crypto.createHmac('sha256', secretKey).update(`${header}.${payload}`).digest('base64')
    
    if (verifiedSignature !== signature) {
        throw new Error('Invalid signature')
    }

    return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'))
}

function login(req, res) {
  let body = ''

  req.on('data', (chunk) => {
    body += chunk.toString()
  })

  req.on('end', () => {
    try{
      const { username, password } = JSON.parse(body)
      const user = users.find((u) => u.username === username && u.password === password)
      const token = generateToken(user, secretKey)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ token }))
    } catch {
      res.statusCode = 401
      res.end('Invalid credentials')
    }
  })
}

function authenticate(req, res) {
  const token = req.headers.authorization.split(" ")[1]

  if (token) {
    try {
      const payload = decodeToken(token, secretKey)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ message: 'Authenticated', user: payload.username }))
    } catch (err) {
      res.statusCode = 401
      res.end('Invalid token')
    }
  } else {
    res.statusCode = 401
    res.end('Unauthorized')
  }
}

module.exports = {
  generateToken,
  login,
  authenticate,
}

