import mongoose from "mongoose";

const collection = 'Usuarios'

const schema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },

    apellido:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    image:{
        type: String,
        required: true
    },

    role: {
        type: String,
        default: 'user'
    },
    
    password: {
        type: String,
        required: true
    },

    cart:{
        type: Array
    }
})

const modelUsers = mongoose.model(collection, schema)

export default modelUsers