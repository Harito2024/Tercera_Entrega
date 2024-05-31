const express = require('express')
const router = express.Router()
const ProductManager = require('../dao/controllers/product-manager.js')
const messagesModel = require('../dao/models/messages.model.js')



router.get('/messages', async (req, res) => {
    try {
        let messages = await messagesModel.find().lean()
        res.send({ result: 'success', payload: messages })
    } catch (error) {
        console.log(error)
    }
})

router.get('/messages/:uid', async (req, res) => {
    let { uid } = req.params
    if (!uid) {
        res.send({ status: 'error', error: 'Debe buscar por ID del producto' })
    }

    let result = await messagesModel.find({ _id: uid })
    res.send({ result: 'success', payload: result })

})

router.post('/messages', async (req, res) => {
    let { user , message } = req.body
    if (!user || !message) {
        res.send({ status: 'error', error: 'Faltan Parametros' })
    }
    let result = await messagesModel.create({ user , message })

 
    res.send({ result: 'success', payload: result })
})

router.put('/messages/:uid', async (req, res) => {
    let { uid } = req.params
    let messageToReplace = req.body
    if (!messageToReplace.user || !messageToReplace.message) {
        res.send({ status: 'error', error: 'Faltan Parametros' })
    }
    let result = await messagesModel.updateOne({ _id: uid }, messageToReplace)
    res.send({ result: 'success', payload: result })
})

router.delete('/messages/:uid', async (req, res) => {
    let { uid } = req.params

    let result = await messagesModel.deleteOne({ _id: uid })

    res.send({ result: 'success', payload: result })
})

router.delete('/messages', async (req, res) => {

    let result = await messagesModel.deleteMany()

    res.send({ result: 'success', payload: result })
})

module.exports = router