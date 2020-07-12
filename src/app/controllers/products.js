const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const { formatPrice, date } = require('../../lib/utils')

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

        if (req.files.lenght == 0) return res.send("Por favor coloque pelo menos uma imagem!!")

        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file, product_id: productId }))
        await Promise.all(filesPromise)

        return res.redirect(`products/${ productId }`)
    },

    async show (req, res) {

        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if (!product) return res.send("Poduto não encontrado")

        const {birthDate, hour, minutes} = date(product.updated_at)

        product.published = {
            birthDate,
            hour: `${ hour }h ${ minutes }min`
        }

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        results = await Product.file(req.params.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`
        }))

        return res.render("products/show", { product, files })
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

        results = await Product.file(id)
        let files = results.rows

        files = files.map(file => ({ ...file,
            src: `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`
        }))

        return res.render("products/edit", { product, categories, files })
    },

    async put (req, res) {
        
        const keys = Object.keys(req.body)

        for (key of keys) {
           if (req.body[key] == "" && key != "removed_files") {
                return res.send("Porfavor, preencha todos os campos!")
            } 
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => File.create({ ...file, product_id: req.body.id }))
            await Promise.all(newFilesPromise)
        }
        
        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const promiseFiles = removedFiles.map(id => File.delete(id))

            await Promise.all(promiseFiles)
        }

        req.body.price = req.body.price.replace(/\D/g, "")

        if (req.body.price != req.body.old_price) {
            const product = await Product.find(req.body.id)
            
            req.body.old_price = product.rows[0].old_price
        }        

        await Product.update(req.body)

        return res.redirect(`/products/${ req.body.id }`)
    },

    async delete (req, res) {

        await Product.delete(req.body.id)

        return res.redirect("/")
    }
}