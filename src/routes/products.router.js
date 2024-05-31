const express = require('express')
const router = express.Router()
exports.router = router
//const ProductManager = require('../controllers/product-manager.js')
const productsModel = require('../dao/models/products.model.js')
//const manager = new ProductManager('../data/products.json')


/* router.get('/products', async (req, res) => {
    try {
        let {limit, page, sort, query } = req.query
        page = page == 0 ? 1 : page
        page = Number(page)
        limit = Number(limit)
        const skip = (page-1) * limit

        const sortOrder = {
            'asc': -1,
            'desc' : 1
        }

        const allProducts = await productsModel.countDocuments()
        
        sort = sortOrder[sort] || null
        let products = await productsModel.find().lean().limit(limit).skip(skip)
        
        if(sort !==null){
            products = await productsModel.find().lean().limit(limit).skip(skip).sort({price:sort})
        }
        
        const totalPages = Math.ceil(allProducts/limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1
        const prevPage = hasPrevPage ? page - 1 : null
        const nextPage = hasNextPage ? page + 1 : null

        const result ={
            payload: products,
            totalPages,
            prevPage,
            page,
            nextPage,
            hasPrevPage,
            hasNextPage,
            prevLink:'',
            nextLink:''
        }

        res.send({total:allProducts, payload: result })

    } catch (error) {
        console.log(error)
    }
}) */

router.get('/products/:pid', async (req, res) => {
    let { pid } = req.params
    try {
        let products = await productsModel.findById({_id: pid})
        res.send({ result: 'success', payload: products })
    } catch (error) {
        console.log(error)
    }
})

router.post('/products', async (req, res) => {
    let { title, description, code, price, status, stock, thumbnail, category  } = req.body
    if (!title || !description || !code || !price || !status || !stock || !thumbnail || !category) {
        res.send({ status: 'error', error: 'Faltan Parametros' })
    }
    let product = await productsModel.create({ title, description, code, price, status, stock, thumbnail, category })


    res.send({ result: 'success', payload: product })
})

router.put('/products/:pid', async (req, res) => {
    let { pid } = req.params
    let productToReplace = req.body
    
    if (!productToReplace.title || !productToReplace.description || !productToReplace.price || !productToReplace.thumbnail || !productToReplace.code || !productToReplace.stock) {
        res.send({ status: 'error', error: 'Faltan Parametros' })
    }
    let product = await productsModel.updateOne({ _id: pid }, productToReplace)
    res.send({ result: 'success', payload: product })
})

router.delete('/products/:pid', async (req, res) => {
    let { pid } = req.params

    let product = await productsModel.deleteOne({ _id: pid })

    res.send({ result: 'success', payload: product })
})


module.exports = router