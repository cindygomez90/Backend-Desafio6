const cartModel = require ("../models/products.model")

class CartsManagerMongo {
    
    async createCart () {
        return await cartModel.create ({ products: [] })
    }
    
    async getCart(cid) {
            const cart = await cartModel.findOne({_id:cid})
            if (!cart) {
                return 'No se encuentra el id del carrito indicado'
            }
            return cart
        } 

        async addProductToCart(cid, pid) {
                const cart = await cartModel.findOne(cid)
                if (!cart) {
                    return 'No existe el carrito'
                }
    
                const productIndex = cart.products.findIndex(p => p.product.equals(pid))
    
                if (productIndex === -1) {
                        cart.products.push({
                        product: pid,
                        quantity: 1
                    });
                } else {                    
                    cart.products[productIndex].quantity += 1
                }
    
                await cart.save()
                return cart
            }
    }

module.exports = CartsManagerMongo
