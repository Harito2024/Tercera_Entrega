const mongoose = require('mongoose')

const userColletion = 'User'

const userSchema = new mongoose.Schema({
    name:{type: String,  required:[true, 'El nombre es obligatorio']},
    lastName:{type: String},
    email:{type: String, required:[true, 'La direccion de correo es obligatorio'], unique:true},
    password:{type:String, },
    rol:{type:String, default:'user', enum:['user', 'admin']},
    status:{type: Boolean, default:true},
    fechaCreacion: {type: Date, default:Date.now}
})

userSchema.set('toJSON',{
    transform:function (dot, ret){
        delete ret.__v
        return ret
    }
})

const userModel=mongoose.model(userColletion, userSchema)

module.exports = userModel