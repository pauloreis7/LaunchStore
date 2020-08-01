const User = require('../models/User')
const mailto = require('../../lib/mail')

const crypto = require('crypto')
const mailer = require('../../lib/mail')

module.exports = {

    loginForm (req, res) {

        return res.render("session/login")
    },

    login (req, res) {
        
        req.session.userId = req.user.id

        return res.redirect('/users')
    },

    logout (req, res) {
        req.session.destroy()

        return res.redirect('/')
    },

    forgotForm (req, res) {

        return res.render('session/forgot-password')
    },

    async forgot (req, res) {

        try {

            const { user } = req

            const token = crypto.randomBytes(20).toString('hex')

            let now = new Date()
            now = now.setHours( now.getHours() + 1 )

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: user.email,
                from: 'launchstore@gmail.com',
                subject: 'Recuperação de senha LaunchStore',
                html: `
                    <h1>Esqueceu a senha ?</h1>

                    <p>Não se preocupe!! Vamos recupera-la para você 😍😍</p>

                    <p>Clique no link abaixo para recuperar sua senha 👇👇</p>

                    <a href="http://localhost:3000/users/password-reset?token=${ token }" target='_blank'>RECUPERAR SENHA</a>
                `
            })

            return res.render('session/forgot-password', {
                success: "Sucesso!! Enviamos um email para você, verifique sua caixa de entrada"
            })
            
        } catch (err) {
            console.error(err)

            return res.render('session/forgot-password', {
                error: "Algo deu errado!! Tente novamente",
                user: req.body
            })
        }
    },
}