const express = require('express')
const productsModel = require('../dao/models/products.model.js')
const { getProductsServices, getProductsByIdServices, addProductsServices, updateProductServices, deleteProductServices } = require('../service/products.service.js')

async function getProducts(req, res) {
    try {
        const result = await getProductsServices({ ...req.query })
        res.json({ result })
    } catch (error) {
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}

async function getProductsById(req, res) {
    try {
        const { pid } = req.params
        const product = await getProductsByIdServices(pid)
        
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }
        return res.json({product})
    } catch (error) {
        console.log('getProductsById=> ', error)
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}

async function addProducts(req, res) {
    try {
        let { title, description, code, price, status, stock, thumbnail, category } = req.body
        if (!title || !description || !code || !price || !status || !stock || !thumbnail || !category) {
            res.send({ status: 'error', error: 'Faltan Parametros' })
        }
        let product = await addProductsServices({...req.body})
        return res.json({product})
    } catch (error) {
        console.log('addProducts=> ', error)
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}

async function deleteProduct(req, res) {
    try {
        let { pid } = req.params
        let product = deleteProductServices(pid)
        if(product){
            return res.json({msg: 'Producto Eliminado', product})
        }else{
            return res.status(404).json({msg:'No se pudo eliminar el producto'})
        }
    } catch (error) {
        console.log('deleteProduct=> ', error)
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}
async function updateProduct(req, res) {
    try {
        let { pid } = req.params
        let { _id, ...rest } = req.body
        let product = await updateProductServices(pid,rest)
        if(product){
            return res.json({msg:'Producto Actualizado corectamente', product})
        }else{
            return res.status(404).json({msg:'No se pudo actualizar el producto'})
        }
    } catch (error) {
        console.log('updateProduct=> ', error)
        return res.status(500).json({ msg: 'Hablar con un administrador' })
    }
}




module.exports = { getProducts, getProductsById, addProducts, deleteProduct, updateProduct }
