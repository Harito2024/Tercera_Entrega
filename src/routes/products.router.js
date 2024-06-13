const express = require('express')
const router = express.Router()
exports.router = router
//const ProductManager = require('../controllers/product-manager.js')
//const manager = new ProductManager('../data/products.json')
//const productsModel = require('../dao/models/products.model.js')
const { getProducts, getProductsById, addProducts, deleteProduct, updateProduct } = require('../controllers/products.js')



router.get('/products', getProducts)
router.get('/products/:pid', getProductsById)
router.post('/products', addProducts)
router.delete('/products/:pid', deleteProduct)
router.put('/products/:pid', updateProduct)


module.exports = router