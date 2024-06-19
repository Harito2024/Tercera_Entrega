const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 8080
const handlebars = require('express-handlebars')
const {Server} = require('socket.io')
const bctypt = require('bcrypt')
const FileStore = require('session-file-store')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')


const productsRouter = require('./routes/products.router.js')
const cartsRouter = require('./routes/carts.router.js')
const messagesRouter = require('./routes/messages.router.js')
const userRouter = require('./routes/user.router.js')
const viewsRouter = require('./routes/views.router.js')
const sessionsRouter = require('./routes/session.router.js')

const productsModel = require('./dao/models/products.model.js')
const messagesModel = require('./dao/models/messages.model.js')
const cookieParser = require('cookie-parser')
const { getProductsByIdServices, getProductsServices, addProductsServices } = require('./service/products.service.js')
const { initialPassport } = require('./config/passport.js')

//Escuchando Puerto
const httpServer = app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})
const socketServer = new Server(httpServer)

//Conectamos la session a FileStore
//const FileStoreInstace = FileStore(session)
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://Ezequiel_280:Juancho_2013@ezequiel280.xegphwu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Ezequiel280',
        ttl:3600
        //mongoOptions:{useNewUrlParser:true, useUnifiedTopology:true},
    }),
    secret: '1234asd', // process.env.SECRET_SESSION
    resave: false,
    saveUninitialized:true
}))

initialPassport()
app.use(passport.initialize())
app.use(passport.session())


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
app.use('/api/sessions', sessionsRouter)

socketServer.on('connection', async (socket)=>{
    console.log('Cliente conectado')

    //let products = await productsModel.find()
    const {payload} = await getProductsServices({})
    socket.emit('products', payload)
    socket.on('addProduct', async product =>{
        //const newProduct = await productsModel.create({...product})
        const newProduct = await addProductsServices({...product})
        console.log(newProduct)
        if(newProduct){
            payload.push(newProduct)
            socket.emit('products', payload)
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
