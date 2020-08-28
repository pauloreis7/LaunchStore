const { hash } = require("bcryptjs")
const { unlinkSync } = require("fs")

const User = require("../models/User")
const Product = require("../models/Product")

const LoadProducts = require('../services/LoadProduct')

const { formatCpfOrCnpj, formatCep } = require("../../lib/utils")

module.exports = {
    
    create(req, res) {
        return res.render('users/register')
    },

    async post(req, res) {

        try {

            let { name, email, password, cpf_cnpj, cep, address } = req.body

            password = await hash(password, 8)

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")


            const userId = await User.create({
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            })

            req.session.userId = userId
            
            return res.redirect('/users')
            
        } catch (err) {
            console.error(err)
        }
    },

    async show(req, res) {

        try {

            const { user } = req

            user.cpf_cnpj = formatCpfOrCnpj(user.cpf_cnpj)
            user.cep = formatCep(user.cep)

            return res.render('users/index', { user })
            
        } catch (err) {
            console.error(err)
        }
    },

    async put(req, res) {
        
        try {

            const { user } = req

            let { name, email, cpf_cnpj, cep, address } = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            await User.update(user.id, {
                name,
                email,
                cpf_cnpj,
                cep,
                address
            })

            return res.render('users/index', {
                success: "Conta atualizada com sucesso!!",
                user: req.body
            })

        } catch (err) {
            console.error(err)

            return res.render('users/index', {
                error: "Erro ao atualizar conta!! Tente novamente"
            })
        }

    },

    async delete(req, res) {

        try {
            
            const products = await Product.findAll({
                where: { user_id: req.body.id }
            })

            const filesPromise = products.map(product => Product.file(product.id))
            const filesResults = await Promise.all(filesPromise)

            await User.delete(req.body.id)
            req.session.destroy()

            filesResults.map(files => {
                files.map( file => {
                    try {
                        unlinkSync(file.path)
                    } catch (err) {
                        console.error(err)
                    }
                })                 
            })

            return res.render("session/login", {
                success: "Conta deletada com sucesso!!"
            })
            
        } catch (err) {
            console.error(err)

            return res.render("users/index", {
                user: req.body,
                error: "Erro ao deletar conta!! Tente novamente"
            })
        }
    },

    async ads(req, res) {
        const products = await LoadProducts.load("products", {
            where: {user_id: req.session.userId}
        })

        return res.render("users/ads", { products })
    }

}