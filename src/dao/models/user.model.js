const mongoose = require('mongoose')

const userColletion = 'User'

const userSchema = new mongoose.Schema({
    name:{type: String,  max:20},
    lastName:{type: String,  max:20},
    email:{type: String, max:100},
})


const userModel=mongoose.model(userColletion, userSchema)

module.exports = userModel