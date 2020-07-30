const User = require('../models/User')
const { compare } = require('bcryptjs')

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

module.exports = {
    login
}