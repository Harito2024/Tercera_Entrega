
const express = require('express')
const productsModel = require('../dao/models/products.model.js')

async function getProductsServices({limit=10, page = 1, sort, query}) {
    try {
        page = page == 0 ? 1 : page
        page = Number(page)
        limit = Number(limit)
        const skip = (page - 1) * limit

        const sortOrder = {
            'asc': -1,
            'desc': 1
        }
        sort = sortOrder[sort] || null

        try {
            if (query) {
                query = JSON.parse(decodeURIComponent(query))
            }
        } catch (error) {
            console.log('Error al parear el query', error)
            query = {category:''}
        }
        const queryProducts = productsModel.find().limit(limit).skip(skip).lean()
        if (sort !== null) {
            queryProducts.sort({ price: sort })
        }

        const [products, total] = await Promise.all([queryProducts, productsModel.countDocuments(query)])

        const totalPages = Math.ceil(total / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1
        const prevPage = hasPrevPage ? page - 1 : null
        const nextPage = hasNextPage ? page + 1 : null

        return {
            totalPages,
            limit,
            query:JSON.stringify(query),
            page,
            prevPage,
            nextPage ,
            hasPrevPage,
            hasNextPage,
            prevLink: '',
            nextLink: '',
            payload: products
        }

    } catch (error) {
        console.log('getProducts=> ', error)
        throw error
    }
}
async function getProductsByIdServices(pid) {
    try {
        return await productsModel.findById(pid)
    } catch (error) {
        console.log('getProductsByIdServices=> ', error)
        throw error
    }
}
async function addProductsServices({ title, description, code, price, status, stock, thumbnail, category }) {
    try {
        return await productsModel.create({ title, description, code, price, status, stock, thumbnail, category })
    } catch (error) {
        console.log('addProductsServices=> ', error)
        throw error
        }
}
async function deleteProductServices(pid) {
    try {
        return  await productsModel.findByIdAndDelete(pid)
    } catch (error) {
        console.log('deleteProduct=> ', error)
        throw error
        }
}
async function updateProductServices(pid, rest) {
    try {
        return await productsModel.findByIdAndUpdate(pid, { ...rest }, { new: true })
    } catch (error) {
        console.log('updateProduct=> ', error)
        throw error
        }
}


module.exports = { 
    getProductsServices, 
    getProductsByIdServices, 
    addProductsServices, 
    deleteProductServices,
    updateProductServices
}