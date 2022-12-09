import mongoose from 'mongoose'

const collection = 'carrito'
const schema = new mongoose.Schema({

    timestamp: {
        type: String,
        require: true
    },

    carrito: {
        type: Array,
        require: true
    }
})

const carritoModel = mongoose.model(collection,schema)

export default carritoModel