const express = require('express')
const router = express.Router()
const { admin, auth } = require('../middleware/auth.js')
const { getProductsServices } = require('../service/products.service.js')
const { getCartByIdService } = require('../service/cart.service.js')
const { homeView, realtimeProductsView, chatView, productsView, cartView, loginGetView, registerGetView, loginPostView, registerPostView, logout } = require('../controllers/views.js')


router.get('/', homeView)
router.get('/realtimeProducts', [auth, admin], realtimeProductsView)
router.get('/chat', auth, chatView)
router.get('/products', auth, productsView)
router.get('/cart/:cid', [auth, admin], cartView)

router.get('/login', loginGetView)
router.post('/login', loginPostView)
router.get('/register', registerGetView)
router.post('/register', registerPostView)
router.get('/logout', logout)

module.exports = router