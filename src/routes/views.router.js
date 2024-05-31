const express = require('express')
const router = express.Router()
const productsModel = require('../dao/models/products.model.js')



router.get('/', async (req, res)=>{
    let products = await productsModel.find().lean()
    return res.render('home', {products})
})

router.get('/realTimeProducts', async (req, res)=>{
    return res.render('realTimeProducts')
})

router.get('/chat',(req, res)=>{
    return res.render('chat')
})



router.get('/products', async (req, res) => {
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

        try {
            if(query)
                query= JSON.parse(decodeURIComponent(query))
        } catch (error) {
            query= {}
        }

    

        const allProducts = await productsModel.countDocuments()
        
        sort = sortOrder[sort] || null
        let products = await productsModel.find(query).lean().limit(limit).skip(skip)
        
        if(sort !==null){
            products = await productsModel.find(query).lean().limit(limit).skip(skip).sort({price:sort})
        }
        
        const totalPages = Math.ceil(allProducts/limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1
        const prevPage = hasPrevPage ? page - 1 : null
        const nextPage = hasNextPage ? page + 1 : null

        const result ={
            payload: products,
            totalPages,
            limit,
            query,
            page,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            prevLink:'',
            nextLink:''
        }

        return res.render('products', {title: 'products', result})
    } catch (error) {
        console.log(error)
    }
})



module.exports = router


/* let productsFiltrados = await productsModel.paginate({category:'Calzado'}, {limit:2, page:1})
console.log(productsFiltrados) */