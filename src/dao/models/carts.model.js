const mongoose = require('mongoose')



const cartColletion = 'Cart'

const cartSchema = new mongoose.Schema({
    products:[{
        _id: false,
        id:{type: mongoose.Schema.Types.ObjectId,ref:'Products'},
        quantity:{type: Number, required: [true]}
    }]
})

cartSchema.set('toJSON',{
    transform:function(doc, ret){
        delete ret.__v
        return ret
    }
})


const cartModel=mongoose.model(cartColletion, cartSchema)

module.exports = cartModel