const fs = require('fs').promises

class ProductManager {

    constructor(path) {
        this.products = [],
        this.path = path
    }

    async addProduct(newObjet) {

        let { title, description, price, thumbnail, code, stock } = newObjet

        
        try {
            let existingProducts = await this.readFilesMio();
            existingProducts = existingProducts || [];
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log('Faltan campos')
                return
            }
            const codeFound = existingProducts.find((product) => product.code === code)
            if (codeFound) {
                console.log('Codigo de Producto repetido')
                return
            }
            const lastId = existingProducts.length > 0 ? existingProducts[existingProducts.length - 1].id : 0;
            const newId = lastId + 1;
            const newProduct = {
                id: newId,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
            existingProducts.push(newProduct);
            await this.saveFilesMio(existingProducts);
            this.products = existingProducts;
            console.log(newProduct);
        } catch (error) {
            console.log('Error al agregar el producto:', error);
        }

    }

    async getProduct() {
        this.products = await this.readFilesMio()
        console.log(this.products)
        res.json(this.products)
    }
    async getProductById(id) {

        try {
            const arrayProducts = await this.readFilesMio()
            const idFound = arrayProducts.find(item => item.id === id)
            if (!idFound) {
                console.log('No se ecuentra el producto con ese id')
            } else {
                console.log('Producto encontrado')
                return idFound
            }
        } catch (error) {
            console.log('Error en lectura de  archivo', error)
        }
    }


    //--------------------Nuevos Metodos----------------//
    async readFilesMio() {
        try {
            const res = await fs.readFile(this.path, 'utf-8')
            const arrayDeProductos = JSON.parse(res)
            return arrayDeProductos
        } catch (error) {
            console.log('Errores al leer los Archivos', error)
        }
    }

    async saveFilesMio(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2))
        } catch (error) {
            console.log('Error al guardar el archivo', error)
        }
    }

    async upDateProduct(id, productUpdate) {
        try {
            const arrayProducts = await this.readFilesMio()

            const index = arrayProducts.findIndex(item => item.id === id)
            if (index !== -1) {
                arrayProducts.splice(index, 1, productUpdate)
                await this.saveFilesMio(arrayProducts)
            } else {
                console.log('No se encontro el producto a actualizar')
            }

        } catch (error) {
            console.log('Error, no se pudo actualizar el producto', error)
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProducts = await this.readFilesMio()
            const deleteUpDate = arrayProducts.filter(item => item.id != id)
            await this.saveFilesMio(deleteUpDate)

        } catch (error) {
            console.log('No se puede pudo borrar el producto')
        }
    }
}

module.exports = ProductManager
