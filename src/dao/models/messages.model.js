const mongoose = require('mongoose')

const messagesColletion = 'Messages'

const messagesSchema = new mongoose.Schema({
    user:{type: String, required: true, max:100},
    message:{type: String, required: true, max:2500},
})


const messagesModel=mongoose.model(messagesColletion, messagesSchema)

module.exports = messagesModel