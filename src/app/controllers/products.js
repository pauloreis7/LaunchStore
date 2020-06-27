const Category = require('../models/Category')
const Product = require('../models/Product')

const { formatPrice } = require('../../lib/utils')

module.exports = {

    async create(req, res) {

        const results = await Category.all()
        const categories = results.rows

        return res.render("products/create", { categories })

        // Category.all().then(
        //     function (results) {
                
        //         const categories = results.rows

        //         return res.render("products/create", { categories })
        //     }
        // ).catch(function (err) {
        //    throw new Error(err) 
        // }) 
    },

    async post(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Porfavor, preencha todos os campos!")
            }
        }

        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        return res.redirect(`products/${ productId }/edit`)
    },

    async edit (req, res) {

        let { id } = req.params

        let results = await Product.find(id)
        const product = results.rows[0]

        if (!product) return res.send("O produto não existe!")

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        results = await Category.all()
        const categories = results.rows

        return res.render("products/edit", { product, categories })
    },

    async put (req, res) {
        
        const keys = Object.keys(req.body)

        for (key of keys) {
           if (req.body[key] == "") {
                return res.send("Porfavor, preencha todos os campos!")
            } 
        }

        req.body.price = req.body.price.replace(/\D/g, "")

        if (req.body.price != req.body.old_price) {
            const product = await Product.find(req.body.id)
            
            req.body.old_price = product.rows[0].old_price
        }        

        await Product.update(req.body)

        return res.redirect(`/products/${ req.body.id }/edit`)
    },

    async delete (req, res) {

        await Product.delete(req.body.id)

        return res.redirect("/")
    }
}