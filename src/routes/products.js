const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const products = require('../app/controllers/products')
const search = require('../app/controllers/search')

const { onlyUsers } = require('../app/middlewares/session')

const ProductValidator = require('../app/validators/product')

// Search
routes.get('/search', search.index)

// Products
routes.get('/create', onlyUsers, products.create)

routes.post('/', onlyUsers, multer.array("photos", 6), ProductValidator.post, products.post)

routes.get("/:id", products.show)

routes.get('/:id/edit', onlyUsers, products.edit)

routes.put('/', onlyUsers, multer.array("photos", 6), ProductValidator.put, products.put)

routes.delete('/', onlyUsers, products.delete)

module.exports = routes