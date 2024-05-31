const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 8080
const handlebars = require('express-handlebars')
const {Server} = require('socket.io')
const bctypt = require('bcrypt')


const productsRouter = require('./routes/products.router.js')
const cartsRouter = require('./routes/carts.router.js')
const messagesRouter = require('./routes/messages.router.js')
const userRouter = require('./routes/user.router.js')
const viewsRouter = require('./routes/views.router.js')
const productsModel = require('./dao/models/products.model.js')
const messagesModel = require('./dao/models/messages.model.js')

//Escuchando Puerto
const httpServer = app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})
const socketServer = new Server(httpServer)

//Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//websocket
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname +'/public'))


//Mongoo
const enviroment = async ()=>{

    await mongoose.connect('mongodb+srv://Ezequiel_280:Juancho_2013@ezequiel280.xegphwu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Ezequiel280')
    .then(()=>{console.log('Conectado a base de datos')})
    .catch(error =>console.error('Error al conectarse a la base de datos'))
    

}

enviroment()

//Rutas
app.use('/api', productsRouter)
app.use('/api', cartsRouter)
app.use('/api', messagesRouter)
app.use('/api', userRouter)
app.use('/', viewsRouter)

socketServer.on('connection', async (socket)=>{
    console.log('Cliente conectado')

    let products = await productsModel.find()

    socket.emit('products', {products})

    socket.on('addProduct', async product =>{
        const newProduct = await productsModel.create({...product})
        console.log(newProduct)
        if(newProduct){
            products.push(newProduct)
            socket.emit('products', {products})
        }
    })

    const messages = await messagesModel.find()
    socket.emit('message', messages)

    socket.on('message', async (data)=>{
        const newMessage = await messagesModel.create({...data})
        console.log(newMessage)
        if(newMessage){
            const messages = await messagesModel.find()
            socket.emit('messageLogs', messages)
        }
    })
    socket.broadcast.emit('new_user')
})
