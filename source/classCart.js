"use strick";

import fs, { stat } from 'fs'
import { parse } from 'path';

//Creacion de class y metodos
class contenedorCarrito {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo
        this.crearArchivo()
    }

    crearArchivo = async () => {
        if (!fs.existsSync(this.nombreArchivo)) {
            let carrito = []
            let jsonCarrito = JSON.stringify(carrito, null, '\t')
            await fs.promises.writeFile(this.nombreArchivo, jsonCarrito)
        }
    }

    leerCarrito = async () => {

        const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
        return JSON.parse(data)
    }


    crearCarrito = async () => {
        const fecha = new Date().toLocaleDateString()
        const jsonCarrito = await this.leerCarrito()
        const propsCarrito = { 

            id: jsonCarrito.length === 0 ? 1 : jsonCarrito[jsonCarrito.length - 1].id + 1, carrito: [],
            time: fecha,
        }

        jsonCarrito.push(propsCarrito)
        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(jsonCarrito, null, 2))
        return propsCarrito.id
    }

    eliminarCarrito = async (id) =>{
        
        const jsonCarrito = await this.leerCarrito()
        const newArrayCarrito = jsonCarrito.filter(element => element.id !== parseInt(id))
        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(newArrayCarrito, null, 2))
    }

    agregarObjeto = async(cartId,objectId) =>{

        const datosCarrito = await this.leerCarrito()
      
        const newCart = datosCarrito.map(cart=>{

           const state = cart.carrito.some(element => element.id === parseInt(objectId))
    
            if(cart.id === parseInt(cartId)){

                if(state == false){
                    cart.carrito.push({
                        id: parseInt(objectId),
                        cantidad: 1
                    }) 

                } else {
                    const idIndexCart = cart.carrito.findIndex(element => element.id === parseInt(objectId))
                    cart.carrito[idIndexCart].cantidad++
                }
            }
            return cart;
        })
        
        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(newCart,null,'\t'))
}

    eliminarObjetoDelCarrito = async (cartId, productId) => {

        const datosCarrito = await this.leerCarrito()
        const indexOfCart = datosCarrito.findIndex (cart => cart.id === parseInt(cartId))
        const objectInCart = datosCarrito[indexOfCart]
        const stateOfCart = objectInCart.carrito.some(element => element.id === parseInt(productId))

        if(stateOfCart === true){
            const newDatosCarrito = datosCarrito.map(carts => {
                
                if(carts.id === parseInt(cartId)){
                    carts.carrito = carts.carrito.filter(element => element.id !== parseInt(productId))
                }
                return carts
            })

            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(newDatosCarrito,null,'\t'))
            return true
        }
    }


}
export default contenedorCarrito