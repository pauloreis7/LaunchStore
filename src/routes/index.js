const express = require('express')
const routes = express.Router()

const home = require('../app/controllers/home')

const products = require('./products')
const users = require('./users')

routes.get('/', home.index)

routes.use('/products', products)
routes.use('/users', users)

// Alias
routes.get('/ads/create', (req, res) => res.redirect('/products/create'))
routes.get('/accounts', ( req, res ) => res.redirect('/users/register'))

module.exports = routes