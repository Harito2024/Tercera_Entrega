const express = require('express')
const router = express.Router()
const { isAutheticaded } = require('../middleware/auth.js')
const { getProductsServices } = require('../service/products.service.js')
const { getCartByIdService } = require('../service/cart.service.js')
const { homeView, realTimeProductsView, chatView, productsView, cartView, loginGetView, registerGetView, loginPostView, registerPostView, logout } = require('../controllers/views.js')


router.get('/', homeView)
router.get('/realTimeProducts', isAutheticaded , realTimeProductsView)
router.get('/chat', isAutheticaded, chatView)
router.get('/products', isAutheticaded, productsView)
router.get('/cart/:cid', isAutheticaded, cartView)

router.get('/login', loginGetView)
router.post('/login', loginPostView)
router.get('/register', registerGetView)
router.post('/register', registerPostView)
router.get('/logout', logout)

module.exports = router