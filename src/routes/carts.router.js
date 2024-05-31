const express = require('express')
const router = express.Router()
//const ProductManager = require('../controllers/product-manager.js')
//const manager = new ProductManager('../data/carritos.json')
const cartModel = require('../dao/models/carts.model.js')
const productModel = require('../dao/models/products.model.js')
const { CURSOR_FLAGS } = require('mongodb')


router.get('/carts', async (req, res) => {
    try {
        let carts = await cartModel.find()
        res.send({ result: 'success', payload: carts })
    } catch (error) {
        console.log(error)
    }
})

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartModel.findById(cid).populate('products.id')

        if (!cart) {
            res.send({ status: 'error', error: 'El carrito buscado no existe' })
        }
        res.send({ result: 'success', payload: cart })

    } catch (error) {
        console.log(error)
    }
})

router.post('/carts', async (req, res) => {
    try {
        const cart = await cartModel.create({})
        res.send({ cart })
    } catch (error) {
        console.log(error)
    }
})

router.post('/carts/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        let cart = await cartModel.findById({ _id: cid })

        if (!cart) {
            res.send({ status: 'error', error: 'El carrito no existe' })
        } else {
            const productInCart = cart.products.find(p => p.id.toString() == pid)
            if (productInCart) {
                productInCart.quantity++
            } else {
                cart.products.push({ id: pid, quantity: 1 })
            }
            cart.save()
            res.send({ cart })
        }

    } catch (error) {
        console.log(error)
    }
})

router.delete('/carts/:cid/product/:pid', async (req, res) => {
    try {
        let { cid, pid } = req.params
        let result = await cartModel.findByIdAndUpdate(cid, { $pull: { 'products': { id: pid } } }, { new: true })
        res.send({ result: 'success', payload: result })
    } catch (error) {
        console.log(error)
    }
})


router.put('/carts/:cid/product/:pid', async (req, res) => {
    try {
        let { cid, pid } = req.params
        const { quantity } = req.body
        if (!Number(quantity)) {
            console.log(quantity)
            res.send('La cantidad debe ser un numero')
        } 
            let result = await cartModel.findOneAndUpdate(
                { _id: cid, 'products.id': pid },
                { $set: { 'products.$.quantity': quantity } },
                { new: true })
        res.send({ result: 'success', payload: result })
    } catch (error) {
        console.log(error)
    }
})

router.put('/carts/:cid', async (req, res) => {
    try {
        let { cid } = req.params 
            let result = await cartModel.findByIdAndUpdate(cid, {$set:{'products':[]} },{new:true})
        res.send({ result: 'success', payload: result })
    } catch (error) {
        console.log(error)
    }
})



module.exports = router