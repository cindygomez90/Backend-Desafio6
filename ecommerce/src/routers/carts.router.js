//importación de módulos
const { Router } = require ("express")
const CartsManagerMongo = require ('../dao/Mongo/cartsManagerMongo')
const cartService = new CartsManagerMongo ()
const ProductManagerMongo = require ('../dao/Mongo/productsManagerMongo')
const productService = new ProductManagerMongo ()

const cartsRouter = Router ()

//armado de CRUD para carts

//MÉTODO GET

//Mongo - Endpoint para solicitar un carrito por id
cartsRouter.get ('/:cid', async (req, res) => {
    try {
        const {cid} = req.params
        const cart = await cartService.getCart (cid) 
        res.send ({
            status: "succes", 
            payload: cart
        })
    } catch (error) {
        console.log (error)
        }
})


//MÉTODO POST

//Mongo - Endpoint para crear un carrito
cartsRouter.post ('/', async (req, res)=> {
    try {
        const result = await cartService.createCart ()

        res.status(200).json ({
            status: "succes",
            payload: result
        })
    } catch (error) {
        console.error('Error al crear el carrito:', error)
        res.status(500).json ("Error al crear el carrito")
        }
    })


//Mongo - Endpoint para agregar un producto a un carrito
cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params        
        const cart = await cartService.getCart(cid)

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encuentra el carrito indicado',
            })
        }

        const product = await productService.getProduct (pid)
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encuentra el producto indicado',
            });
        }
        cart.products.push({
            product: product._id,
            quantity: 1,            
        })
        await cart.save()

        res.json({
            status: 'success',
            payload: cart,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Error al agregar el producto al carrito',
        })
    }
})

//MÉTODO PUT

//Mongo - Endpoint para actualizar el carrito con un arreglo de productos
cartsRouter.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const newProducts = req.body
        const cart = await cartService.getCart(cid)

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encuentra el carrito indicado',
            })
        }
        
        cart.products = newProducts
        await cart.save()

        res.json({
            status: 'success',
            payload: cart,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el carrito',
        })
    }
})


//Mongo - Endpoint para actualizar solo la cantidad de un producto en el carrito
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const cart = await cartService.getCart(cid)

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encuentra el carrito indicado',
            })
        }

        const product = cart.products.find((p) => p.product.equals(pid))

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encuentra el producto indicado en el carrito',
            });
        }

        product.quantity = quantity
        await cart.save()

        res.json({
            status: 'success',
            payload: cart,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar la cantidad del producto',
        })
    }
})


//MÉTODO DELETE

//Mongo - Endpoint para eliminar un producto de un carrito
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const cart = await cartService.getCart(cid)

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encuentra el carrito indicado',
            })
        }

        const productIndex = cart.products.findIndex(
            (product) => product.product.equals(pid)
        )

        if (productIndex === -1) {
            console.log('Productos en el carrito:', cart.products)

            return res.status(404).json({
                status: 'error',
                message: 'No se encuentra el producto indicado en el carrito',
            })
        }
        
        cart.products.splice(productIndex, 1)

        await cart.save()

        res.json({
            status: 'success',
            payload: cart,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el producto del carrito',
        })
    }
})

//Mongo - Endpoint para eliminar todos los productos de un carrito
cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCart(cid)

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encuentra el carrito indicado',
            });
        }

        cart.products = []
        await cart.save()

        res.json({
            status: 'success',
            message: 'Se eliminaron todos los productos del carrito',
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar todos los productos del carrito',
        })
    }
})


module.exports = cartsRouter