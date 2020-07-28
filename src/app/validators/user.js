const User = require('../models/User')

async function post(req, res, next) {
    
    const keys = Object.keys(req.body)

    for (key of keys) {
        if(req.body[key] == "") {
            return res.render('users/register', {
                error: 'Por Favor preencha todos os campos!!',
                user: req.body
            })
        }
    }

    let {email, cpf_cnpj, password, repeatPassword} = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

    // check if user alredy exists
    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })

    if (user) return res.render('users/register', {
        error: 'Esse usuário já existe!!',
        user: req.body
    })

    // check if password match
    if (password != repeatPassword) return res.render('users/register', {
        error: 'As senhas devem ser iguais!!',
        user: req.body
    })

    next()
}

module.exports = {
    post
}