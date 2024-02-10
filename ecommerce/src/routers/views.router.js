//importación de módulos
const { Router } = require ("express")
const viewsRouter = Router()
const CartsManagerMongo = require ('../dao/Mongo/cartsManagerMongo')
const cartService = new CartsManagerMongo ()
const ProductManagerMongo = require ('../dao/Mongo/productsManagerMongo')
const productService = new ProductManagerMongo ()
const MessageManagerMongo = require ('../dao/Mongo/messagesManagerMongo')
const messageService = new MessageManagerMongo ()
const { productModel} = require ("../dao/models/products.model")
const { cartModel} = require ('../dao/models/carts.model')

//Mongo - ruta para home.handlebars
viewsRouter.get('/home', async (req, res) => {
    try {
        const products = await productService.getProducts()
        res.render('home', { products })
    } catch (error) {
        console.error(error)
        res.render('error', { message: 'Error al obtener la lista de productos.' })
    }
})


//Mongo - ruta para realTimeProducts.handlebars
viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productService.getProducts()
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.log(error);
        res.render('error', { message: 'Error al intentar obtener la lista de productos.' })
    }
})

viewsRouter.post('/', async (req, res) => {
    try {
        const products = await productService.getProducts()
        res.render('realTimeProducts', { products })
    } catch (error) {
        console.log(error);
        res.render ("Error al intentar obtener la lista de productos");
        return
    }
})

//ruta para chat.handlebars
viewsRouter.get('/chat', async (req, res) => {
    try {
        const messages = await messageService.getMessages()   
        res.render('chat', { messages })        
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.render('error', { message: 'Error al intentar obtener los mensajes.' });
    }   
})

viewsRouter.post('/api/messages/sendMessage', async (req, res) => {
    try {
        res.redirect('/chat')
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.render('error', { message: 'Error al intentar enviar el mensaje.' });
    }
})

//ruta para products.handlebars
viewsRouter.get('/products', async (req, res) => {    
    const {limit = 10, pageQuery = 1, category, order, status} = req.query   
    
    const filter = {}
        if (category) {
            filter.category = category;
        }
    
        if (status !== undefined) {
            filter.status = status === 'true' ? true : status === 'false' ? false : undefined
        }

    const sortOptions = {}
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
    totalPages
    } = await productModel.paginate(filter, {limit, page: pageQuery, sort: sortOptions, lean: true})
    res.render('products', {
        products: docs,
        totalPages: totalPages,
        hasPrevPage, 
        hasNextPage,
        prevPage, 
        nextPage,
        page 
    })
})

//ruta para cart.handlebars
viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartModel.findOne({_id:cid})        
        res.render('cart', { cart })
    } catch (error) {
        console.error(error)
        res.render('error', { message: 'Error al obtener detalle del carrito.' })
    }
})

//ruta para login.handlebars
viewsRouter.get ('/login', (req, res) => {
    res.render ('login')
})

//ruta para register.handlebars
viewsRouter.get ('/register', (req, res) => {
    res.render ('register')
})
module.exports = viewsRouter