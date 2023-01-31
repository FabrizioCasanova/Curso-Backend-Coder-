export default class Productos {
    
    static get model(){
        return 'productos'
    }

    static get schema(){
       return {
        nombre: {
            type: String,
            require: true
        },
    
        precio: {
            type: String,
            require: true
        },
    
        stock: {
            type: String,
            require: true
        },
    
        marca: {
            type: String,
            require: true
        },
    
        code: {
            type: Number,
            require: true
        },
    
        timestamp: {
            type: Number,
            require: true
        },
    
        imagen: {
            type: String,
            require: true
        }    
       } 
    }
}




// import mongoose from 'mongoose'

// const collection = 'productos'
// const schema = new mongoose.Schema({

//     nombre: {
//         type: String,
//         require: true
//     },

//     precio: {
//         type: String,
//         require: true
//     },

//     stock: {
//         type: String,
//         require: true
//     },

//     marca: {
//         type: String,
//         require: true
//     },

//     code: {
//         type: Number,
//         require: true
//     },

//     timestamp: {
//         type: Number,
//         require: true
//     },

//     imagen: {
//         type: String,
//         require: true
//     }
// })

// const productosModel = mongoose.model(collection,schema)

// export default productosModel