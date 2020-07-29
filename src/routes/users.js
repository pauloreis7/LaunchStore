const express = require('express')
const routes = express.Router()

const section = require('../app/controllers/section')
const users = require('../app/controllers/users')

const Validator = require('../app/validators/user')

// routes.get('/login', section.loginForm)

// routes.post('/login', section.login)

// routes.post('/logout', section.logout)

// // forgot password

// routes.get('/forgot-password', section.forgotForm)

// routes.get('/password-reset', section.resetForm)

// routes.post('/forgot-password', section.forgot)

// routes.post('/password-reset', section.reset)

// // User
routes.get('/register', users.create)

routes.post('/register', Validator.post, users.post)

routes.get('/', Validator.show, users.show)

routes.put('/', Validator.put, users.put)

// routes.delete("/", users.delete)

module.exports = routes