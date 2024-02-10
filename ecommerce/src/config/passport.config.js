//config interna de passport
const passport = require('passport')
const local = require('passport-local')
const GithubStrategy = require('passport-github2') 
const UserManagerMongo = require ('../dao/Mongo/usersManagerMongo')
const sessionService = new UserManagerMongo ()
const { createHash, isValidPassword } = require('../utils/hashBcrypt')
const LocalStrategy = local.Strategy



const initializePassport = () => {
    //estrategia para register
    passport.use('register', new LocalStrategy({    
        passReqToCallback: true, 
        usernameField: 'email'   
    }, async (req, username, password, done) => {       
        const {first_name, last_name, email} = req.body     
        try {
            let  user = await sessionService.getUserBy ({email})

            if (user) return done(null, false)       

            let newUser = {
                first_name, 
                last_name,
                email,
                password: createHash(password)
            }   

            let result = await sessionService.createUser (newUser)
            return done(null, result)
        } catch (error) {
            return done(error)   
        }

    }))

    //estrategia para login
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {    
        try {
            const user = await sessionService.getUserBy({email: username})
            if (!user) {
                console.log('user no encontrado')
                return done(null, false)    
            }
            if (!isValidPassword(password, user.password)) return done(null, false) 
            return done(null, user)    
        } catch (error) {
            return done(error)
        }
    }))

    //estrategia para github
    passport.use('github', new GithubStrategy({         
        clientID:'Iv1.76e1c1dcf997321f',
        clientSecret: '12ff2188ae743e78135a170c5e787393d4a866bb',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done)=>{
        console.log('profile: ', profile)
        try {
                let user = await sessionService.getUserBy({email: profile._json.email})
                if (!user) {
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: profile._json.name,
                        email: profile._json.email,
                        password: ''
                    }

                    let result = await sessionService.createUser (newUser)
                    return done(null, result)
                }

                return done(null, user)
        } catch (error) {
            done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)    
    })
    
    passport.deserializeUser(async (id, done) => {  
        let user = await sessionService.getUserBy({_id: id})  
        done(null, user)    
    })
}

module.exports = { initializePassport }