//importación de módulos
const { Router } = require ("express")
const ProductManagerMongo = require ('../dao/Mongo/productsManagerMongo')
const productService = new ProductManagerMongo ()
const { productModel} = require ("../dao/models/products.model")
const productsRouter = Router ()

//armado de CRUD para productos

//MÉTODO GET

//Mongo - Endpoint para solicitar todos los productos
/*productsRouter.get('/', async (req, res)=>{  
    try {
        const products = await productService.getProducts() 
        res.json({
            status: 'success',
            result: products
        })
    } catch (error) {
        console.log(error)
    }
})*/

productsRouter.get('/', async (req, res) => {
    try {
        const { limit = 10, pageQuery = 1, category, order, status } = req.query

        const filter = {};
        if (category) {
            filter.category = category;
        }

        if (status !== undefined) {
            filter.status = status === 'true' ? true : status === 'false' ? false : undefined
        }

        const sortOptions = {};
        if (order === 'asc') {
            sortOptions.price = 1
        } else {
            sortOptions.price = -1
        }

        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            totalPages,
        } = await productModel.paginate(filter, { limit, page: pageQuery, sort: sortOptions, lean: true })

        res.json({
            status: 'success',
            result: {
                products: docs,
                totalPages: totalPages,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page,
            },
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            error: error.message,
        })
    }
})


//Mongo - Endpoint para solicitar un producto por id
productsRouter.get('/:pid', async (req, res)=>{  
    try {      
        const { pid } = req.params        
        const product = await productService.getProduct (pid)
        res.json({
            status: 'success',
            result: product
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener el producto por ID.'
        })
    }
}) 

//MÉTODO POST

//Mongo - Endpoint para agregar un nuevo producto
productsRouter.post('/', async (request, responses)=>{                
    try {                               
        const { body } = request
        const result = await productService.createProduct (productNew)

        responses.send({
            status: 'success',
            result
        })
    } catch (error) {
        console.log(error)
    }
})


//MÉTODO PUT

//Mongo - Endpoint para actualizar campos de un producto por id
productsRouter.put('/:pid', async (req, res)=>{
    try {
    const { pid } = req.params
    const productToUpdate = req.body
    const product = await productService.updateProduct (pid, productToUpdate)
    
    res.status(200).send({
        status: 'success',
        message: product
    })
    } catch (error) {
        console.log(error)
    }
})

//MÉTODO DELETE

productsRouter.delete('/:pid', async (request, responses) => {
    try {
        const { pid } = request.params
        const result = await productService.deleteProduct (pid)

        if (!result) {
            return responses.status(404).json({ success: false, message: 'Producto no encontrado.' })
        }
        responses.json({ success: true, message: 'Producto eliminado correctamente.' })
    } catch (error) {
        console.log(error);
        responses.status(500).json({ success: false, message: 'Error al eliminar el producto.' })
    }
})


module.exports = productsRouter

