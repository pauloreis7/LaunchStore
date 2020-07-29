const User = require("../models/User")
const { formatCpfOrCnpj, formatCep } = require("../../lib/utils")

module.exports = {
    
    create(req, res) {
        return res.render('users/register')
    },

    async post(req, res) {

        const userId = await User.create(req.body)

        req.session.userId = userId
        
        return res.redirect('/users')
    },

    async show(req, res) {

        const { user } = req

        user.cpf_cnpj = formatCpfOrCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('users/index', { user })
    },

    async put(req, res) {
        return res.send("ATUALIZADO")
    }
}