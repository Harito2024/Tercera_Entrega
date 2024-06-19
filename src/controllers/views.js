const express = require('express')
const { getProductsServices } = require('../service/products.service.js')
const { getCartByIdService } = require('../service/cart.service.js')
const { registerUser, getUserEmail } = require('../service/users.services.js')
const { createHash, isValidPassword } = require('../utils/bcryptPassword.js')



async function homeView(req, res) {
    const limit = 20
    let { payload } = await getProductsServices({limit})

    const user = req.session.user 
    return res.render('home', { products: payload, title:'home', user })
}

async function realtimeProductsView(req, res) {
    const user = req.session.user
    return res.render('realTimeProducts', {user:user})
}

async function chatView(req, res) {
    const user = req.session.user 
    return res.render('chat', {user:user})
}

async function productsView(req, res) {
    const result = await getProductsServices({ ...req.query })
    const user = req.session.user 
    return res.render('products', { title: 'products', result, user })
}

async function cartView(req, res) {
    const { cid } = req.params
    const cart = await getCartByIdService(cid)
    const user = req.session.user 
    res.render('cart', { title: 'cart', cart: cart, user })
}

async function loginGetView(req, res) {
    const okLogin = req.session.user !== undefined
    if(okLogin){
        return res.redirect('/')
    }
    return res.render('login', { title: 'login' })
}

async function registerGetView(req, res) {
    const okLogin = req.session.user !== undefined
    if(okLogin){
        return res.redirect('/')
    }

    return res.render('register', { title: 'register' })
}

async function registerPostView(req, res) {
    if(!req.user){
        return res.redirect('/regiter')
    }
    return res.redirect('/login')
}

async function loginPostView(req, res) {
    if(!req.user){
        return res.redirect('/login')
    }
    req.session.user={
        name: req.user.name,
        lastName: req.user.lastName,
        email: req.user.email,
        rol: req.user.rol,
    }
    return res.redirect('/')

}

async function logout(req, res) {
    req.session.destroy(err =>{
        if(err){
            return res.send ({status: false, body:err})
        }else{
            return res.redirect('/login')
        }
    })

}

async function loginGitHub(req, res) {
if(!req.user){
    return res.redirect('/login')
}
req.session.user={
    name: req.user.name,
    lastName: req.user.lastName,
    email: req.user.email,
    rol: req.user.rol,
}
return res.redirect('/')
}

module.exports = {
    homeView,
    realtimeProductsView,
    chatView,
    productsView,
    cartView,
    loginGetView,
    registerGetView,
    registerPostView,
    loginPostView,
    logout,
    loginGitHub
}
