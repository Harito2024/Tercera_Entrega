const express = require('express')
const userModel = require('../dao/models/user.model.js')

async function getUserEmail(email){
    try {
        return await userModel.findOne({email})    
    } catch (error) {
        console.log('getUserEmail=> ', error)
        throw error
    }
}
async function registerUser(user){
    try {
        return await userModel.create({...user})   
    } catch (error) {
        console.log('registerUser=> ', error)
        throw error
    }
}

module.exports = { 
    getUserEmail,
    registerUser,
}