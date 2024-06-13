const express = require('express')
const router = express.Router()
const ProductManager = require('../dao/product-manager.js')
const userModel = require('../dao/models/user.model.js')
const manager = new ProductManager('../data/carritos.json')



router.get('/user', async (req, res) => {
    try {
        let user = await userModel.find().lean()
        res.send({ result: 'success', payload: user })
    } catch (error) {
        console.log(error)
    }


    /* try {
        const arrayProducts = await manager.readFilesMio()
        let limit = parseInt(req.query.limit)
        if (limit) {
            const arraylimit = arrayProducts.slice(0, limit)
            return res.send(arraylimit)
        } else {
            return res.send(arrayProducts)
        }
    } catch (error) {
        console.log(error)
        return res.send('Error al procesar el pedido')
    } */
})

router.get('/user/:uid', async (req, res) => {
    let { uid } = req.params
    if (!uid) {
        res.send({ status: 'error', error: 'Debe buscar por ID del producto' })
    }

    let result = await userModel.find({ _id: uid })
    res.send({ result: 'success', payload: result })

})

router.post('/user', async (req, res) => {
    let { name, lastName, email } = req.body
    if (!name || !lastName || !email ) {
        res.send({ status: 'error', error: 'Faltan Parametros' })
    }
    let result = await userModel.create({ name, lastName, email })


    res.send({ result: 'success', payload: result })
})

router.put('/user/:uid', async (req, res) => {
    let { uid } = req.params
    let userToReplace = req.body
    if (!userToReplace.name || !userToReplace.lastName || !userToReplace.email ) {
        res.send({ status: 'error', error: 'Faltan Parametros' })
    }
    let result = await userModel.updateOne({ _id: uid }, userToReplace)
    res.send({ result: 'success', payload: result })
})

router.delete('/user/:uid', async (req, res) => {
    let { uid } = req.params

    let result = await userModel.deleteOne({ _id: uid })

    res.send({ result: 'success', payload: result })
})





module.exports = router