const cartsModel = require('../dao/models/carts.model.js')
const productsModel = require('../dao/models/products.model.js')

async function getCartByIdService(cid) {
    try {
        return await cartsModel.findById(cid).populate('products.id').lean()
    } catch (error) {
        console.log('getCartByIdService=> ', error)
        throw error
    }
}

async function createCartService() {
    try {
        return await cartsModel.create({})
    } catch (error) {
        console.log('createCartService=> ', error)
        throw error
    }
}

async function addProductsInCartService(cid, pid) {
    try {
        const cart = await cartsModel.findById(cid)
        if (!cart) {
            return res.status(404).json({ msg: 'El carrito no exsite', })
        } else {
            const productInCart = cart.products.find(product => product.id.toString() === pid)
            if (!productInCart) {
                cart.products.push({ id: pid, quantity: 1 })
            } else {
                productInCart.quantity++
            }
        }
        cart.save()
        return cart
    } catch (error) {
        console.log('addProductsInCartService=> ', error)
        throw error
    }
}

async function deleteProductsInCartService(cid, pid) {
    try {
        return await cartsModel.findByIdAndUpdate(cid, { $pull: { 'products': { id: pid } } }, { new: true })
    } catch (error) {
        console.log('deleteProductsInCartService=> ', error)
        throw error
    }
}

async function updateProductsInCartService(cid, pid, quantity) {
    try {
        return await cartsModel.findOneAndUpdate(
            { _id: cid, 'products.id': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        )
    } catch (error) {
        console.log('updateProductsInCartService=> ', error)
        throw error
    }
}

async function deleteCartService(cid) {
    try {
        return await cartsModel.findByIdAndDelete(cid)
    } catch (error) {
        console.log('deleteCartService=> ', error)
        throw error
    }
}

async function deleteAllProductsInCartService(cid) {
    try {
        return await cartsModel.findByIdAndUpdate(cid, { $set: { 'products': [] } }, { new: true })
    } catch (error) {
        console.log('deleteAllProductsInCartService=> ', error)
        throw error
    }
}

module.exports = {
    getCartByIdService,
    createCartService,
    addProductsInCartService,
    updateProductsInCartService,
    deleteProductsInCartService,
    deleteAllProductsInCartService,
    deleteCartService
}