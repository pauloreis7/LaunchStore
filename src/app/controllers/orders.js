const mailer = require('../../lib/mail')

const User = require("../models/User")

const LoadProducts = require('../services/LoadProduct')

const email = (product, seller, buyer) => `
    <h1>Olá ${ seller.name }</h1>
    <h2>Você tem um novo pedido de compra do seu produto</h2>
    <hr />

    <h3>Sobre o produto<h3>
    <ul>
        <li><strong>Produto: <strong>${ product.name }</li>
        <li><strong>Valor: <strong>${ product.formattedPrice }</li>
    </ul>
    <p></p>

    <h3>Sobre o comprador<h3>
    <ul>
        <li><strong>Nome: <strong>${ buyer.name }</li>
        <li><strong>Email: <strong>${ buyer.email }</li>
        <li><strong>Endereço: <strong>${ buyer.address }</li>
        <li><strong>CEP: <strong>${ buyer.cep }</li>
    </ul>
    <p></p>

    <h4>Entre em contato com o comprador para finalizar a venda!!</h4>
    <p></p>
    
    <h5>Atenciosamente, LaunchStore 🚀🚀🚀</h5>
`

module.exports = {

    async post(req, res) {

        try {

            const { id } = req.body

            const product = await LoadProducts.load('product', {
                where: { id }
            })

            const seller = await User.findOne({
                where: { id: product.user_id }
            })

            const buyer = await User.findOne({
                where: { id: req.session.userId }
            })
            
            await mailer.sendMail({
                to: seller.email,
                from: 'launchStore.com.br',
                subject: "Novo pedido de compra",
                html: email(product, seller, buyer)
            })

            return res.render('orders/success')

        } catch (err) {
            console.error(err)
            return res.render('orders/error')
        }
    }
}