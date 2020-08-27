const LoadProducts = require('../services/LoadProduct')

module.exports = {

    async index(req, res) {
        
        try {

            let products = await LoadProducts.load("products")
        
            if (!products) return res.render("home/index", {
                error: "Não encontramos nenhum produto :("
            })
           
            products = products.filter(( product, index ) => index > 2 ? false : true )

            return res.render("home/index", { products })

        } catch (err) {
            console.error(err)
        }
    }
}