const express = require('express')
const userModel = require('../dao/models/user.model.js')
const router = express.Router()


router.post('/register', async (req, res)=>{
    const {firts_name, last_name, email, age, password} = req.body

    try {
        const newUser = userModel({firts_name, last_name, email, age, password})
        await newUser.save()
        res.redirect('/login')
    } catch (err) {
        res.status(500).send('Error al registrar usuario')        
    }
})

router.post('/login', async (req, res)=>{
    const {email, password} = req.body
    console.log(email, password)
    try {
        const user = await userModel.findOne({email})
        console.log(user)
        if(!user){
            return res.status(404).send('Usuario no encontrado')
        }
        req.session.user= {
            id: user._id,
            firts_name: user.firts_name,
            last_name: user.lastName,
            email: user.email,
            age: user.age,
        }
        console.log(req.session.user)
        res.redirect('/login')
    } catch (error) {
        res.status(500).send('Error al iniciar sesion')
    }
})

router.post('/login', async (req, res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).send('Error al iniciar sesion')
        }
        res.redirect('/login')
    })
})

module.exports = router