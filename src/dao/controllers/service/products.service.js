const productsModel = require("../../models/products.model.js")
const express = require('express')

const getProductsService =  async (req , res) => {

    try {
        let { limit, page, sort, query } = req.query
        page = page == 0 ? 1 : page
        page = Number(page)
        limit = Number(limit)
        const skip = (page - 1) * limit

        const sortOrder = {
            'asc': -1,
            'desc': 1
        }

        const allProducts = await productsModel.countDocuments()

        sort = sortOrder[sort] || null
        let products = await productsModel.find().limit(limit).skip(skip).lean()

        if (sort !== null) {
            products = await productsModel.find().lean().limit(limit).skip(skip).sort({ price: sort })
        }

        const totalPages = Math.ceil(allProducts / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1
        const prevPage = hasPrevPage ? page - 1 : null
        const nextPage = hasNextPage ? page + 1 : null

        const result = {
            payload: products,
            totalPages,
            prevPage,
            page,
            nextPage,
            hasPrevPage,
            hasNextPage,
            prevLink: '',
            nextLink: ''
        }

        res.send({ total: allProducts, payload: result })

    } catch (error) {
        console.log(error)
    }
}

module.exports = getProductsService