const express = require('express')
const routes = express.Router()

const section = require('../app/controllers/section')
const users = require('../app/controllers/users')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session') 

const { loggedRedirectToUser, onlyUsers } = require('../app/middlewares/session')

// Session
routes.get('/login', loggedRedirectToUser,section.loginForm)

routes.post('/login', SessionValidator.login, section.login)

routes.post('/logout', section.logout)

// Forgot password
routes.get('/forgot-password', section.forgotForm)

routes.get('/password-reset', section.resetForm)

routes.post('/forgot-password', SessionValidator.forgot, section.forgot)

routes.post('/password-reset', SessionValidator.reset, section.reset)

// User
routes.get('/register', users.create)

routes.post('/register', UserValidator.post, users.post)

routes.get('/', onlyUsers, UserValidator.show, users.show)

routes.put('/', UserValidator.put, users.put)

routes.delete("/", users.delete)

routes.get('/ads', users.ads)

module.exports = routes