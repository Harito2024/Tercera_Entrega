const express = require('express')
const cartsModel = require('../dao/models/carts.model.js')
const { getCartByIdService, createCartService, addProductsInCartService, deleteProductsInCartService, updateProductsInCartService, deleteCartService, deleteAllProductsInCartService } = require('../service/cart.service.js')

async function getCartById(req, res) {
    try {
        const { cid } = req.params
        //const cart = await cartsModel.findById(cid).populate('products.id')
        const cart = await getCartByIdService(cid)
        if (cart) {
            return res.send({ msg: 'Carrito encontrado exitosamente', payload: cart })
        } else {
            res.status(404).json({ msg: 'El Id de carritono fue encontrado' })
        }
    } catch (error) {
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}

async function createCart(req, res) {
    try {
        //const cart = await cartsModel.create({})
        const cart = await createCartService()
        return res.send({ msg: 'Carrito creado exitosamente', payload: cart })
    } catch (error) {
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}

async function addProductsInCart(req, res) {
    try {
        const { cid, pid } = req.params
        //const cart = await cartsModel.findById(cid)
        const cart = await addProductsInCartService(cid, pid)
        if (!cart) {
            return res.status(404).json({ msg: 'El carrito no exsite', })
        }
        return res.send({ msg: 'Carrito actualizado', payload: cart })
    } catch (error) {
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}

async function deleteProductsInCart(req, res) {
    try {
        const { cid, pid } = req.params
        const cart = await deleteProductsInCartService(cid, pid)

        if (!cart) {
            return res.status(404).json({ msg: 'No se pudo borrar el producto' })
        }
        return res.json({ msg: 'Producto eliminado', payload: cart })
    } catch (error) {
        console.log('deleteProductsInCart=> ', error)
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}

async function updateProductsInCart(req, res) {
    try {
        const { cid, pid } = req.params
        let { quantity } = req.body
        if (!Number(quantity)) {
            res.send('La cantidad a modificar debe ser un numero')
        }
        const cart = await updateProductsInCartService(cid, pid, quantity)
        res.json({ msg: 'Carrito actualizado', payload: cart })
    } catch (error) {
        console.log('updateProductsInCart=> ', error)
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}

async function deleteCart(req, res) {
    try {
        const { cid } = req.params
        const cart = await deleteCartService(cid)
        return res.send({ msg: 'Carrito eliminado', payload: cart })
    } catch (error) {
        console.log('deleteCart=> ', error)
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}

async function deleteAllProductsInCart(req, res) {
    try {
        const { cid } = req.params
        const cart = await deleteAllProductsInCartService(cid)
        return res.send({ msg: 'Producto eliminado', payload: cart })
    } catch (error) {
        console.log('deleteAllProductsInCart=> ', error)
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}

module.exports = {
    getCartById,
    createCart,
    addProductsInCart,
    updateProductsInCart,
    deleteProductsInCart,
    deleteAllProductsInCart,
    deleteCart
}
