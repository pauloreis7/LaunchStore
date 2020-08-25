const Product = require('../models/Product')

const { formatPrice } = require('../../lib/utils')

module.exports = {

    async index(req, res) {
        
        try {

            const products = await Product.findAll()
            
            if (!products) return res.send("Não possuimos produtos agora!!")

            async function getImage(productId) {
                
                let files = await Product.file(productId)
                files = files.map(file => 
                    `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`    
                )
                
                return files[0]
            }

            const productsPromise = products.map(async product => {
                product.img = await getImage(product.id)

                product.price = formatPrice(product.price)
                product.oldPrice = formatPrice(product.old_price)

                return product
            }).filter(( product, index ) => index > 2 ? false : true )

            const lastAddedProducts = await Promise.all(productsPromise)

            return res.render("home/index", { products: lastAddedProducts })

        } catch (err) {
            console.error(err)
        }
    }

}