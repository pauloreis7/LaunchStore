const Product = require('../models/Product')

const LoadServices = require('../services/LoadProduct')

module.exports = {

    async index (req, res) {
        
        try {

            let { search, category } = req.query

            if(!search || search.toLowerCase() == "todos os produtos") search = null

            let products = await Product.search({search, category})

            const productsPromise = products.map(LoadServices.format)

            products = await Promise.all(productsPromise)
                        
            const terms = {
                term: search || "Todos os produtos",
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