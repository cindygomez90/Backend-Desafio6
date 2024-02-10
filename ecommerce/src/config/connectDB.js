//configuración de conexión con BD
const mongoose = require("mongoose")

module.exports = async () => {  
    try {
        await mongoose.connect('mongodb+srv://CINDYGOMEZ:1501@cluster0.orwmj55.mongodb.net/ecommerce?retryWrites=true&w=majority') 
        console.log('Base de datos conectada')        
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error)
    }
}