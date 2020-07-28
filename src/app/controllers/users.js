const User = require("../models/User")

module.exports = {
    
    create(req, res) {
        return res.render("users/register")
    },

    async post(req, res) {

        const userId = await User.create(req.body)
        
        return res.redirect('/users')
    },

    show(req, res) {
        return res.send("Cadastrei")
    }
}