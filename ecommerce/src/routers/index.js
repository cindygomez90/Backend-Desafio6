const { Router } = require ("express")
const viewsRouter = require ("../routers/views.router")
const productsRouter = require ("../routers/products.router")
const cartsRouter = require ("../routers/carts.router")
const messagesRouter = require ("../routers/messages.router")
const sessionsRouter = require("./sessions.router")

const router = Router()

//importación de las rutas
router.use('/', viewsRouter)
router.use('/api/products', productsRouter)
router.use('/api/carts', cartsRouter)
router.use('/api/messages', messagesRouter)
router.use('/api/sessions', sessionsRouter)

module.exports = router