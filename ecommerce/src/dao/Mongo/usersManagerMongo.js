const { userModel }  = require ("../models/users.model")

class UserManagerMongo {
    async getUsersPaginate(limit = 10, page = 1) {
        return await userModel.paginate({}, {limit, page, lean:true})
    }
        
    async getUsers () {
        return await userModel.find ({})
    }

    async getUserBy (filter) {
        return await userModel.findOne (filter)
    }

    async createUser (newUser) {
        return await userModel.create (newUser)
    }

    async updateUser (uid, userUpdate) {
        return await userModel.findOneAndUpdate({_id: uid}, userUpdate)
    }
    
    async deleteUser (uid) {
        return await userModel.findByIdAndDelete ({_id:uid})
    }
}


//así lo hizo el profe
/*class UserDaoMongo {    
    constructor () {        
        this.userModel =userModel
    }
}

getUsersPaginate = async (limit=10, page=1) => await this.userModel.paginate ({}, {limit, page, lean:true})

getUsers = async _ => await this.userModel.find ({})

getUserBy = async (filter) => await this.userModel.findOne (filter)

createUser = async (newUser) => await this.userModel.create (newUser)

updateUser = async (uid, userUpdate) => await this.userModel.findOneAndUpdate ({_id:uid}, userUpdate)

deleteUser = async (uid) => await this.userModel.findOneAndDelete ({_id:uid})

module.exports = UserDaoMongo */

module.exports = UserManagerMongo
