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

module.exports = {
    login,
    forgot
}