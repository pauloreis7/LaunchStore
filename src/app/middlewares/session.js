function onlyUsers(req, res, next) {
    
    if(!req.session.userId) return res.render('session/login', {
        error: "Faça login ou registre-se para continuar!!",
    })

    next()
}

function loggedRedirectToUser(req, res, next) {
    
    if (req.session.userId) return res.redirect('/users')

    next()
}

module.exports = {
    onlyUsers,
    loggedRedirectToUser
}