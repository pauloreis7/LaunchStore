const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllField(body) {
    
    const keys = Object.keys(body)

    for (key of keys) {
        if(body[key] == "") {
            return {
                error: 'Por Favor, preencha todos os campos!!',
                user: body
            }
        }
    }
}

async function post(req, res, next) {

    const notFillAllFields = checkAllField(req.body)
    if(notFillAllFields) return res.render('user/register', notFillAllFields)
    
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

async function show(req, res, next) {
    const { userId: id } = req.session

    const user = await User.findOne({ where: {id} })

    if (!user) return res.render('users/register', {
        error: "Esse usuário não existe!!"
    })

    req.user = user

    next()
}

async function put(req, res, next) {
    
    const { id, password } = req.body

    if(!password) return res.render('users/index', {
        error: "Coloque a senha para atualizar seu cadastro!",
        user: req.body
    })

    const notFillAllFields = checkAllField(req.body)
    if(notFillAllFields) return res.render('users/index', notFillAllFields)

    const user = await User.findOne({
        where: {id}
    })

    const passed = await compare(password, user.password)

    if(!passed) return res.render('users/index', {
        error: "Senha incorreta!!",
        user: req.body
    })

    req.user = user

    next()
}

module.exports = {
    post,
    show,
    put
}