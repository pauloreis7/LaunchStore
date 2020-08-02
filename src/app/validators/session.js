const User = require('../models/User')
const { compare } = require('bcryptjs')
const connectPgSimple = require('connect-pg-simple')

async function login(req, res, next) {

    const { password, email } = req.body
    
    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("session/login", {
        error: "Esse usuário não existe!!",
        user: req.body
    })

    const passed = await compare(password, user.password)

    if(!passed) return res.render("session/login", {
        error: "Senha incorreta!!",
        user: req.body
    })

    req.user = user

    next()
}

async function forgot(req, res, next) {

    try {

        const { email } = req.body

        let user = await User.findOne({ where: { email } })
        
        if (!user) return res.render('session/forgot-password', {
            error: "Email não cadastrado!!",
            user: req.body
        })

        req.user = user

        next()
    } catch (err) {
        console.error(err)

        return res.render('session/forgot-password', {
            error: "Algo deu errado!!"
        })
    }
}

async function reset(req, res, next) {

    const { email, password, passwordRepeat, token } = req.body

    const user = await User.findOne({ where: { email } })

    // catch if user exists
    if(!user) return res.render('session/reset-password', {
        error: "Esse usuário não existe!!",
        user: req.body,
        token
    })

    // verify if new passwords match
    if (password != passwordRepeat) return res.render('session/reset-password', {
        error: "A senha e a repetição de senha devem ser iguais!!",
        user: req.body,
        token
    })

    // verify if token match
    if(token != user.reset_token) return res.render('session/reset-password', {
        error: "Sua chave para mudar senha está inválida!! Requisite uma nova recuperação",
        user: req.body,
        token
    })

    // verify if token expired
    let now = new Date()
    now = now.setHours( now.getHours() )

    if(now > user.reset_token_expires) return res.render('session/reset-password', {
        error: "Sua chave expirou!! Requisite uma nova recuperação",
        user: req.body,
        token
    })

    req.user = user
    
    next()
}

module.exports = {
    login,
    forgot,
    reset
}