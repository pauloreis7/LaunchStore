const Product = require('../models/Product')

const { formatPrice, date } = require('../../lib/utils')

async function getImages(productId) {
    let files = await Product.file(productId)
    files = files.map( file => ({
        ...file,
        src: `${ file.path.replace("public", "") }`
    }))

    return files
}

async function format(product) {

    const files = await getImages(product.id)
    product.img = files[0].src
    product.files = files
    product.formattedPrice = formatPrice(product.price)
    product.formattedOldPrice = formatPrice(product.old_price)

    const {birthDate, hour, minutes} = date(product.updated_at)

    product.published = {
        birthDate,
        hour: `${ hour }h ${ minutes }min`
    }
    
    return product
}

const LoadServices = {
    load(service, filter) {
        this.filter = filter
        
        return this[service]()
    },

    async product() {

        try {
            const product = await Product.findOne(this.filter)
        
            return format(product)

        } catch (err) {
            console.error(err)
        }
    },

    async products() {

        try {

            const products = await Product.findAll(this.filter)

            const productsPromise = products.map(format)

            return Promise.all(productsPromise)
            
        } catch (err) {
            console.error(err)
        }
    },

    format
}

module.exports = LoadServices