const Product = require('../models/Product')

const { formatPrice } = require('../../lib/utils')

module.exports = {

    async index (req, res) {
        
        try {

            let results,
                params = {}

            const { filter, category } = req.query

            if(!filter) return res.redirect("/")

            params.filter = filter

            if (category) {
                params.category = category
            }

            results = await Product.search(params)

            async function getImage (productId) {
                let results = await Product.file(productId)
                const files = results.rows.map( file => file.src =  `${ req.protocol }://${ req.host.headers }${ file.src.replace("public", "") }` )

                return files[0]
            }

            const productsPromise = results.rows.map( async product => {
                product.img = await getImage(product.id)

                product.price = formatPrice(product.price)
                product.old_price = formatPrice(product.old_price)

                return product
            } )

            const products = await Promise.all(productsPromise)

            const search = {
                term: req.query.search,
                total: products.length
            }

            return res.render("/search/index", { products, search })

        } catch (err) {
            console.error(err)
        }

    }
}