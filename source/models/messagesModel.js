import mongoose from 'mongoose'

const collection = 'mensajes'
const schema = new mongoose.Schema({

    author: {

        id:{
            type: String,
            require: true
        },

        nombre: {
            type: String,
            require: true
        },

        apellido: {
            type: String,
            require: true
        },

        edad: {
            type: String,
            require: true
        },

        alias: {
            type: String,
            require: true
        },
    },

    text: {
        type: String,
        require: true
    },

})

const messagesModel = mongoose.model(collection, schema)

export default messagesModel;