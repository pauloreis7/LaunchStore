const express = require('express')

const routes = express.Router()
const multer = require('./app/middlewares/multer')

const products = require('./app/controllers/products')
const home = require('./app/controllers/home')


routes.get('/', home.index)

routes.get('/ads/create', function (req, res) {
    return res.redirect('/products/create')
})

routes.get('/products/create', products.create)

routes.post('/products', multer.array("photos", 6) , products.post)

routes.get("/products/:id", products.show)

routes.get('/products/:id/edit', products.edit)

routes.put('/products', multer.array("photos", 6), products.put)

routes.delete('/products', products.delete)

module.exports = routes