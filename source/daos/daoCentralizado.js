import mongoose from "mongoose";
import Productos from "../models/productModel.js";
import Carrito from "../models/carritoModel.js";
import dotenv from "../config/dotenv.js";

export default class DaoCentralizado {
    constructor(){
        this.connection = mongoose.connect(`mongodb+srv://${dotenv.mongo.USER}:${dotenv.mongo.PASSWORD}@codercluster.vgx1dq2.mongodb.net/${dotenv.mongo.DATABASE}?retryWrites=true&w=majority`)
        const timestamps = {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}}
    
        const productsSchema = mongoose.Schema(Productos.schema, timestamps)
        const cartSchema = mongoose.Schema(Carrito.schema, timestamps)

        this.models = {
            [Productos.model] : mongoose.model(Productos.model, productsSchema),
            [Carrito.model] : mongoose.model(Carrito.model, cartSchema)
        }
    }

    getAll = (opcion, entidad) => {
        if(!this.models[entidad]) throw new Error (' La entidad mencionada no existe')
        return this.models[entidad].find(opcion)
    }

    save = (opcion, entidad) => {
        if(!this.models[entidad]) throw new Error (' La entidad mencionada no existe')
        return this.models[entidad].create(opcion)
    }

    getById = (opcion, entidad) => {
        if(!this.models[entidad]) throw new Error (' La entidad mencionada no existe')
        return this.models[entidad].findOne(opcion)
    }

    deleteById = (opcion, entidad) => {
        if(!this.models[entidad]) throw new Error (' La entidad mencionada no existe')
        return this.models[entidad].deleteOne(opcion)
    } 
    

    

}