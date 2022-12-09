import carritoModel from "../models/carritoModel.js";

class contenedorCarritoMongo {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo
    }

    leerCarrito = async () => {

        return await carritoModel.find({})

    }
    crearCarrito = async () => {
       
     const fecha = new Date().toLocaleDateString()
     const newCarrito = await carritoModel.create({ carrito: [], timestamp: fecha,})
     return newCarrito._id.valueOf()

    }

    eliminarCarrito = async (id) =>{
        
        return await carritoModel.findByIdAndDelete(id)
        
    }

    agregarObjeto = async(cartId,objectId) =>{

        const datosCarrito = await this.leerCarrito()
        const indexOfCart = datosCarrito.findIndex (cart => cart.id === (cartId))
        const objectInCart = datosCarrito[indexOfCart] 

        const state = objectInCart.carrito.some(element => element.id === (objectId))
    
            if(state == false){
                objectInCart.carrito.push({
                id: (objectId),
                cantidad: 1
            }) 

            } else {
                const idIndexCart = objectInCart.carrito.findIndex(element => element.id === (objectId))
                objectInCart.carrito[idIndexCart].cantidad++
            }
        
            await carritoModel.updateOne({_id: cartId}, {$set : { carrito: objectInCart.carrito }})
}

    eliminarObjetoDelCarrito = async (cartId, productId) => {

        const datosCarrito = await this.leerCarrito()
        const indexOfCart = datosCarrito.findIndex (cart => cart.id === (cartId))
        const objectInCart = datosCarrito[indexOfCart]
        const stateOfCart = objectInCart.carrito.some(element => element.id === (productId))

        if(stateOfCart === true){
                
            const propiedadCarrito = objectInCart.carrito.filter(element => element.id !== (productId))            
            await carritoModel.updateOne({_id: cartId}, {$set : { carrito: propiedadCarrito }})
            return true
        }
    }
}
export default contenedorCarritoMongo