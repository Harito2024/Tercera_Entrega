const express = require('express')
const { getProductsServices } = require('../service/products.service.js')
const { getCartByIdService } = require('../service/cart.service.js')
const { registerUser, getUserEmail } = require('../service/users.services.js')



async function homeView(req, res) {
    let { payload } = await getProductsServices({})

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
    const { password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        console.log('Las contraseñas no son iguales')
        return res.redirect('/register')
    }
    const user = await registerUser({ ...req.body })
    if (user) {
        const userName = `${user.name} ${user.lastName}`
        req.session.user = userName
        req.session.rol = user.rol
        return res.redirect('/')
    }
    return res.redirect('/register')
}

async function loginPostView(req, res) {
    const { email, password } = req.body
    const user = await getUserEmail(email)

    if (user && user.password === password) {
        const userName = `${user.name} ${user.lastName}`
        req.session.user = userName
        req.session.rol = user.rol
        return res.redirect('/')
    }
    return res.redirect('/login')
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
}
