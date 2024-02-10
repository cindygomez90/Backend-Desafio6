const { Router } = require ("express")
const bcrypt = require('bcrypt')
const UserManagerMongo = require ('../dao/Mongo/usersManagerMongo')
const sessionService = new UserManagerMongo ()
const ProductManagerMongo = require ('../dao/Mongo/productsManagerMongo')
const productService = new ProductManagerMongo ()
const passport = require ('passport')
const sessionsRouter = Router ()

//Endpoint para el ingreso del usuario
/*sessionsRouter.post ('/login', async (req, res)=>{
    const {email, password} = req.body       
    
    const user = await sessionService.getUserBy ({email})
    console.log (user)
    if (!user) return res.send ({status: 'error', error: 'Usuario con ese mail no existe'})

    req.session.user = {id: user._id, username: user.first_name, role: user.role }
    console.log ('req session user sessions', req.session.user)
    const products = await productService.getProducts()
    res.render('products', { user: req.session.user, products})
})*/

sessionsRouter.post ('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}), async (req, res)=>{
    const {email, password} = req.body       
    
    const user = await sessionService.getUserBy ({email})
    console.log (user)
    if (!user) {
        return res.send ({
            status: 'error', 
            error: 'Usuario con ese mail no existe'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.send({ status: 'error', error: 'Contraseña incorrecta' })
    }

    req.session.user = {id: user._id, username: user.first_name, role: user.role }
    console.log ('req session user sessions', req.session.user)

    const products = await productService.getProducts()
    res.render('products', { user: req.session.user, products})
})
//validación si el usuario es administrador
function auth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    if (req.session.user.role === 'admin') {
        return next()
    } else {
        return res.status(403).send('Acceso denegado')
    }
}

sessionsRouter.get('/products', auth, (req, res) => {
    res.render('products', { user: req.session.user });
})

sessionsRouter.get('/faillogin', async (req, res) => {
    res.send({error: 'falla en el register'})
})

//Endpoint para el registro del usuario
/*sessionsRouter.post ('/register', (req, res)=>{
    try {        
        const {first_name, last_name, email, password, role} = req.body       
        console.log (first_name, last_name, email, password, role)
        if (first_name === '' || password === '') return res.send ('faltan llenar campos obligatorios')
    
        const newUser = {
            first_name,
            last_name,
            email,
            password,
            role: role || 'user'
        }
        const result = sessionService.createUser (newUser)
    
        res.send ({status: 'success', payload: newUser })
    } catch (error) {
        res.send ({status:'error', error:error.message})        
    }
})*/

sessionsRouter.post ('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}), async (req, res)=>{
    try {        
        const {first_name, last_name, email, password, role} = req.body       
        console.log (first_name, last_name, email, password, role)
        if (first_name === '' || password === '') {
            return res.send ('faltan llenar campos obligatorios')
        } 

        const existingUser = await sessionService.getUserBy({ email })
        if (existingUser) {
            return res.send({
                status: 'error',
                error: 'El correo electrónico ya está registrado',
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
    
        const newUser = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: role || 'user'
        }
        const result = await sessionService.createUser (newUser)
    
        res.send ({status: 'success', payload: newUser })
    } catch (error) {
        res.send ({status:'error', error:error.message})        
    }
})

sessionsRouter.get('/failregister', async (req, res) => {
    res.send({error: 'falla en el register'})
})


/*sessionsRouter.post ('/logout', (req, res)=>{       
    req.session.destroy (error =>{
        if (error) return res.send ('Logout error')
        res.send ({status:'success', message: 'logout ok'})
    })
})*/

//Endpoint para el cierre de sesión del usuario
sessionsRouter.post('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.send({ status: 'error', message: 'Logout error' })
        }
        res.redirect('/login')
    })
})



//Endpoint para github
sessionsRouter.get('/github', passport.authenticate('github', {scope:['user:email']}),async (req, res) => {})


sessionsRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/api/sessions/login'} ),async (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})



module.exports = sessionsRouter