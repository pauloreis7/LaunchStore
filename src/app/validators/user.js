const User = require('../models/User')

async function post(req, res, next) {
    
    const keys = Object.keys(req.body)

    for (key of keys) {
        if(req.body[key] == "") {
            return res.send("Porfavor, preencha todos os campos!!")
        }
    }

    let {email, cpf_cnpj, password, repeatPassword} = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

    // check if user alredy exists
    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })

    if (user) return res.send("Usuário já existente!!")

    // check if password match
    if (password != repeatPassword) return res.send("As senhas devem ser iguais!!")

    next()
}

module.exports = {
    post
}