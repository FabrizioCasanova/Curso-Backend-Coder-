import productosModel from "../models/productModel.js";

//Creacion de class y metodos
class ContendedorMongo {
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo
    }

    save = async (object) => {
        
        object.code = parseInt(Math.random()*100000000),
        object.timestamp = Date.now()

         const newObject = await productosModel.create(object)
        return newObject._id.valueOf()
    }

    getAll = async () => {

        return await productosModel.find({})

    }

    getById = async (idObject) => {
        
        return await productosModel.findOne({_id: idObject})    
        
    
    }

    deleteById = async (objectId) => {
      
        return await productosModel.findByIdAndDelete(objectId)

    }

    updateFile = async (objeto, id) =>{
        
        return await productosModel.findByIdAndUpdate(id,objeto) 

}}

export default ContendedorMongo

