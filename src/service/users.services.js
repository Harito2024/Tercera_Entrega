const express = require('express')
const userModel = require('../dao/models/user.model.js')


async function getUserById(id){
    try {
        return await userModel.findById(id)    
    } catch (error) {
        console.log('getUserById=> ', error)
        throw error
    }
}
async function getUserEmail(email){
    try {
        return await userModel.findOne({email})    
    } catch (error) {
        console.log('getUserEmail=> ', error)
        throw error
    }
}
async function registerUser(user){
    /* console.log(user) */
    try {
        return await userModel.create({...user})
    } catch (error) {
        console.log('registerUser=> ', error)
        throw error
    }
}

module.exports = {
    getUserById, 
    getUserEmail,
    registerUser,
}