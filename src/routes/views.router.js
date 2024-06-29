const express = require('express')
const router = express.Router()
const { admin, auth } = require('../middleware/auth.js')
const {
    homeView,
    realtimeProductsView,
    chatView,
    productsView,
    cartView,
    loginGetView,
    registerGetView,
    loginPostView,
    registerPostView,
    logout,
    loginGitHub }= require('../controllers/views.js')
const passport = require('passport')


router.get('/', homeView)
router.get('/realtimeProducts', [auth, admin], realtimeProductsView)
router.get('/chat', auth, chatView)
router.get('/products', auth, productsView)
router.get('/cart/:cid', [auth, admin], cartView)
router.get('/login', loginGetView)
router.get('/logout', logout)
router.get('/register', registerGetView)

//router.post('/register',passport.authenticate('register',{failureRedirect:'/register'}), registerPostView)
//router.post('/login',passport.authenticate('login',{failureRedirect:'/login'}), loginPostView)

router.get('/api/sessions', passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})
router.get('/api/sessions/githubcallback', passport.authenticate('github',{failureRedirect:'/register'}),loginGitHub)
 
  


module.exports = router