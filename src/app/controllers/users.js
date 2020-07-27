const User = require("../models/User")

module.exports = {
    
    create(req, res) {
        return res.render("users/register")
    },

    async post(req, res) {
        
        return res.send("FOI!!")
    }
}