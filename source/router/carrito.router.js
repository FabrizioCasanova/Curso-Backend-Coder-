import { Router } from "express";
import contenedorCarrito from "../daos/classCart.js";
import __dirname from "../utils.js";
import Contenedor from "../daos/class.js";
import exportadoDeContendedores from "../daos/config.js";

const path = __dirname+'/carrito.json'

const container = new exportadoDeContendedores[0]('archivodeprueba')
const carrito = new exportadoDeContendedores[1](path)


const router = Router()

router.get('/', async (req,res) => {

    const arrayCarrito = await carrito.leerCarrito()
    res.send({arrayCarrito})
})

router.post('/', async (req, res) => {
   
   const carritoId = await carrito.crearCarrito()
    res.send(`Carrito creado con el ID: ${carritoId}`)      
})

router.delete('/:id', async (req,res) =>{

    const {id} = req.params
    await carrito.eliminarCarrito(id)
    const datosCarrito = await carrito.leerCarrito()
    const estado = datosCarrito.some(element => element.id == id)
    if( estado === true ){
        res.send ('No se ha podido encontrar el carrito a eliminar')
    } else {
        res.send (`Carrito con ID ${id} fue eliminado con exito`)
    }
})


router.get('/:id/productos', async (req,res) =>{
    const {id} = req.params
    const datosCarrito = await carrito.leerCarrito()
    const productById = datosCarrito.find(element => element.id === parseInt(id))
    res.send (productById)
})

router.post('/:idCart/productos/:idProduct', async (req,res) => {

    const {idCart, idProduct} = req.params
    const datosProducto = await container.getAll()

    const ifExistProduct = datosProducto.some(product => product.id == idProduct)

    if(ifExistProduct == true){
        const datosCarrito = await carrito.leerCarrito()
        const ifExist = datosCarrito.some(cart => cart.id == idCart)
    
    if(ifExist === true){
        await carrito.agregarObjeto(idCart, idProduct)
        res.send(`Objeto con ID ${idProduct} agregado con exito`)
    } else
    res.send ('No se encontro el carrito')

    } else {
        res.send('No se encotrno el producto')
    }
    
})

router.delete('/:idCart/productos/:idProduct', async (req,res) => {
    const datosCarrito = await carrito.leerCarrito()
    const {idCart, idProduct} = req.params

    const ifExistCart = datosCarrito.some(cart => cart.id == idCart)

    if(ifExistCart == false){
        return res.send (`El carrito con ${idCart} no existe`)
    }
    const ifProductExist = await carrito.eliminarObjetoDelCarrito(idCart,idProduct) 
    
    if(ifProductExist == true){
        res. send(`El producto con ID ${idProduct} fue eliminado con exito del carrito con ID ${idCart}`) 
    } else {
        res.send(`El producto con ID ${idProduct} no se encuentra en el carrito con ID ${idCart}`)
    }
})

export default router