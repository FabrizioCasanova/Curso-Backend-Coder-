import mongoose from "mongoose";

const collection = 'Usuarios'

const schema = new mongoose.Schema({
    nombre:{
        type: String,
        require: true
    },

    apellido:{
        type: String,
        require: true
    },

    email:{
        type: String,
        require: true,
        unique: true
    },

    role: {
        type: String,
        default: 'user'
    },
    
    password: {
        type: String
    }
})

const modelUsers = mongoose.model(collection, schema)

export default modelUsers