const Product = require('../models/Product')

const { formatPrice } = require('../../lib/utils')
const { search } = require('../models/Product')

module.exports = {

    async index (req, res) {
        
        try {

            let results,
                params = {}

            const { search, category } = req.query

            params.search = req.query.search

            if (category) {
                params.category = category
            }

            let products = await Product.search(params)

            async function getImages(productId) {
                let files = await Product.file(productId)
                files = files.map( file => `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }` )

                return files[0]
            }

            const productsPromise = products.map( async product => {
                product.img = await getImages(product.id)

                product.price = formatPrice(product.price)
                product.old_price = formatPrice(product.old_price)

                return product
            })

            products = await Promise.all(productsPromise)

            const terms = {
                term: req.query.search,
                total: products.length
            }

            const categories = products.map( product => ({
                id: product.category_id,
                name: product.category_name
            })).reduce((categoriesFiltered, category) => {

                const found = categoriesFiltered.some( cat => cat.id == category.id)

                if (!found) {
                    categoriesFiltered.push(category)
                }
                
                return categoriesFiltered
            }, [])

            return res.render('search/index', { products, terms, categories })

        } catch (err) {
            console.error(err)
        }
    }
}