const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const products = require('../app/controllers/products')
const search = require('../app/controllers/search')

// Search
routes.get('/search', search.index)

// Products
routes.get('/create', products.create)

routes.post('/', multer.array("photos", 6) , products.post)

routes.get("/:id", products.show)

routes.get('/:id/edit', products.edit)

routes.put('/', multer.array("photos", 6), products.put)

routes.delete('/', products.delete)

module.exports = routes