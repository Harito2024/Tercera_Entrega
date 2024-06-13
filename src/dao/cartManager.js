const fs = require('fs').promises

class CartManager {

    constructor() {
        this.path = 'carts.json'
        this.carts = []
    }

    async getCarts() {
        const response = await fs.readFile(this.path, 'utf-8')
        const responseJSON = JSON.parse(response)
        return responseJSON
    }

    async getCartProducts(id) {
        const carts = await this.getCarts()
        const cart = carts.find(cart => cart.id == id)
        if (cart) {
            return cart.products
        } else {
            console.log('Carrito no encontrado')
        }
    }

    async newCart() {
        let existingCarts = await this.getCarts()
        let newId = existingCarts.length

        const newCart = {
            id: ++newId,
            products: []
        }

        this.carts = await this.getCarts()
        this.carts.push(newCart)

        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        return newCart
    }

    async addProductToCart(cart_id, product_id) {
        const carts = await this.getCarts()
        const index = carts.findIndex((cart) => cart.id == cart_id)

        if (index !== -1) {
            const cartProducts = await this.getCartProducts(cart_id)
            const existingProductsIndex = cartProducts.findIndex((product) => product.product_id == product_id)

            if (existingProductsIndex !== -1) {
                cartProducts[existingProductsIndex].quantity = cartProducts[existingProductsIndex].quantity + 1
            } else {
                cartProducts.push(
                    {
                        product_id,
                        quantity: 1
                    }
                )
            }
            carts[index].products = cartProducts

            await fs.writeFile(this.path, JSON.stringify(carts, null, 2))
            console.log('Producto agregado con exito')
        } else {
            console.log('El carrito no fue encontrado')
        }

    }


}

module.exports = CartManager