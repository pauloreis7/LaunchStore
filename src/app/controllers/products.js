const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const { formatPrice, date } = require('../../lib/utils')

module.exports = {

    async create(req, res) {

        try {
            
            const categories = await Category.findAll()

            return res.render("products/create", { categories })

        } catch (err) {
            console.error(err)
        }
    },

    async post(req, res) {

        try {

            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send("Porfavor, preencha todos os campos!!")
                }
            }

            if (req.files.lenght == 0) return res.send("Por favor coloque pelo menos uma imagem!!")

            let { category_id, name, description, old_price, price, quantity, status } = req.body

            price =  price.replace(/\D/g, "")

            const productId = await Product.create({
                category_id,
                user_id: req.session.userId,
                name,
                description, 
                old_price: old_price || price, 
                price, 
                quantity, 
                status: status || 1
            })

            const filesPromise = req.files.map(file => File.create({ ...file, product_id: productId }))
            await Promise.all(filesPromise)

            return res.redirect(`products/${ productId }`)
            
        } catch (err) {
            console.error(err)
        }
        
    },

    async show (req, res) {

        try {

            const product  = await Product.find(req.params.id)

            if (!product) return res.send("Poduto não encontrado")

            const {birthDate, hour, minutes} = date(product.updated_at)

            product.published = {
                birthDate,
                hour: `${ hour }h ${ minutes }min`
            }

            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            let files = await Product.file(req.params.id)
            files = files.map(file => ({
                ...file,
                src: `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`
            }))

            return res.render("products/show", { product, files })
            
        } catch (err) {
            console.error(err)
        }        
    },

    async edit (req, res) {

        try {

            let { id } = req.params

            const product = await Product.find(id)

            if (!product) return res.send("O produto não existe!")

            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            const categories = await Category.all()

            let files = await Product.file(id)

            files = files.map(file => ({ ...file,
                src: `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`
            }))

            return res.render("products/edit", { product, categories, files })
            
        } catch (err) {
            console.error(err)
        }
    },

    async put (req, res) {
        
        try {
            
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

            await Product.update(req.body.id, {
                category_id: req.body.category_id,
                name: req.body.name,
                description: req.body.description, 
                old_price: req.body.old_price,
                price: req.body.price, 
                quantity: req.body.quantity, 
                status: req.body.status,
            })

            return res.redirect(`/products/${ req.body.id }`)
            
        } catch (err) {
            console.error(err)
        }
    },

    async delete (req, res) {

        try {

            await Product.delete(req.body.id)

            return res.redirect("/")
            
        } catch (err) {
            console.error(err)
        }        
    }
}