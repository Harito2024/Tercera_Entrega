const express = require('express')

function auth(req, res, next){
    if(req.session?.user){
        return next()
    }else{
        res.redirect('/login')
    }
}

function admin(req, res, next){
    if(req.session?.rol === 'admin'){
        return next()
    }else{
        res.redirect('/')
    }
}


 
module.exports = {auth, admin}