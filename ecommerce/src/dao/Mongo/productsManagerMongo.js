const { productModel }  = require ("../models/products.model")

class ProductManagerMongo {
    
    async getProducts() {
        return await productModel.find({})
    }

    async getProduct (pid) {
        return await productModel.findOne ({_id:pid})
    }

    async createProduct (productNew) {
        return await productModel.create (productNew)
    }

    async updateProduct (pid, productToUpdate) {
        return await productModel.findOneAndUpdate({_id: pid}, productToUpdate,{ new: true })
    }

    async deleteProduct (pid) {
        return await productModel.findByIdAndUpdate(pid,{status: false})
    }
}


module.exports = ProductManagerMongo