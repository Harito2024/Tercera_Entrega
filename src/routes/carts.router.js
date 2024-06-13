const express = require('express')
const router = express.Router()
//const ProductManager = require('../controllers/product-manager.js')
//const manager = new ProductManager('../data/carritos.json')

const { CURSOR_FLAGS } = require('mongodb')
const { getCartById, createCart, addProductsInCart, deleteProductsInCart, deleteCart, updateProductsInCart, deleteAllProductsInCart } = require('../controllers/carts.js')
const cartModel = require('../dao/models/carts.model.js')



router.get('/carts', async (req, res) => {
    try {
        let carts = await cartModel.find().lean
        res.send({ result: 'success', payload: carts })
    } catch (error) {
        console.log(error)
    }
})

router.get('/carts/:cid', getCartById)
router.post('/carts', createCart)
router.post('/carts/:cid/products/:pid', addProductsInCart)
router.delete('/carts/:cid/products/:pid', deleteProductsInCart)
router.delete('/carts/:cid', deleteCart)
router.put('/carts/:cid/products/:pid', updateProductsInCart)
router.put('/carts/:cid', deleteAllProductsInCart)



 

module.exports = router