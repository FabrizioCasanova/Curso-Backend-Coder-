import { Router } from "express";
// import contenedorCarrito from "../daos/classCart.js";
import { servicioCarrito } from "../service/repositorios/servicios.js";
import __dirname from "../utils.js";
// import Contenedor from "../daos/class.js";
// import exportadoDeContendedores from "../daos/config.js";
import modelUsers from "../models/users.js";
import nodemailer from 'nodemailer'

// const path = __dirname+'/carrito.json'

// const container = new exportadoDeContendedores[0]('archivodeprueba')
// const carrito = new exportadoDeContendedores[1](path)


const router = Router()

router.get('/', async (req,res) => {

    const arrayCarrito = await servicioCarrito.getAll()
    res.send({arrayCarrito})
})

router.post('/', async (req, res) => {
   
   const carritoId = await servicioCarrito.save()
    res.send(`Carrito creado con el ID: ${carritoId}`)      
})

router.delete('/:id', async (req,res) =>{

    const {id} = req.params
    await servicioCarrito.deleteById(id)
    const datosCarrito = await servicioCarrito.getAll()
    const estado = datosCarrito.some(element => element.id == id)
    if( estado === true ){
        res.send ('No se ha podido encontrar el carrito a eliminar')
    } else {
        res.send (`Carrito con ID ${id} fue eliminado con exito`)
    }
})


router.get('/:id/productos', async (req,res) =>{
    const {id} = req.params
    const datosCarrito = await servicioCarrito.getAll()
    const productById = datosCarrito.find(element => element.id === parseInt(id))
    res.send (productById)
})

// router.post('/:idCart/productos/:idProduct', async (req,res) => {

//     const {idCart, idProduct} = req.params
//     const datosProducto = await servicioProductos.getAll()

//     const ifExistProduct = datosProducto.some(product => product.id == idProduct)

//     if(ifExistProduct == true){
//         const datosCarrito = await servicioCarrito.getAll()
//         const ifExist = datosCarrito.some(cart => cart.id == idCart)
    
//     if(ifExist === true){
//         await carrito.agregarObjeto(idCart, idProduct)
//         res.send(`Objeto con ID ${idProduct} agregado con exito`)
//     } else
//     res.send ('No se encontro el carrito')

//     } else {
//         res.send('No se encotrno el producto')
//     }
    
// })

// router.delete('/:idCart/productos/:idProduct', async (req,res) => {
//     const datosCarrito = await servicioCarrito.getAll()
//     const {idCart, idProduct} = req.params

//     const ifExistCart = datosCarrito.some(cart => cart.id == idCart)

//     if(ifExistCart == false){
//         return res.send (`El carrito con ${idCart} no existe`)
//     }
//     const ifProductExist = await carrito.eliminarObjetoDelCarrito(idCart,idProduct) 
    
//     if(ifProductExist == true){
//         res. send(`El producto con ID ${idProduct} fue eliminado con exito del carrito con ID ${idCart}`) 
//     } else {
//         res.send(`El producto con ID ${idProduct} no se encuentra en el carrito con ID ${idCart}`)
//     }
// })

router.get('/cart', async (req,res)=> {

    const perfil = req.session.user
  
    if(perfil === undefined){
        res.redirect('../form/login')
    } else {
        const usuario = await modelUsers.findOne({_id: perfil.id})
        res.render('cart', {cart: usuario.cart})
    }
    
})

router.post('/cart', async (req,res) => {
    const orden = req.body
    
    const perfil = req.session.user

   const usuario = await modelUsers.findOne({_id: perfil.id})
   
    const {cart} = usuario

    cart.push(orden)

   await modelUsers.updateOne({_id: perfil.id},{$set:{cart:cart}})

  
})

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'fabri.casanova2003@gmail.com',
        pass: 'lljjegdhmjfztzmi'                                   
    }
})

router.get('/email', async (req,res)=> {

    const perfil = req.session.user

    const usuario = await modelUsers.findOne({_id: perfil.id})
    const nombreUsuario = usuario.nombre
    const apellidoUsuario = usuario.apellido
    const emailUsuario = usuario.email
    let arrayCarrito = usuario.cart

    if(arrayCarrito.length === 0){

        res.status(400).send({status: "Success", message: "No hay elementos para comprar"})    

    } else {
    
    let div = ''
    
    div += `

    <p> Nueva compra hecha por ${nombreUsuario} ${apellidoUsuario} ${emailUsuario} </p>

    `
    arrayCarrito.forEach(element => {
        div +=
        `
       <p> ${element.titulo} </p>
       <p> ${element.cantidad} </p>        
       <p> ${element.precio} </p>
       <img src="${element.imagen}" alt="">
        ` 
     })

     await transport.sendMail({
        from: "Fabrizio Casanova <fabri.casanova2003@gmail.com>",
        to: `${emailUsuario}`,
        subject: "Orden de compra",
        html: div
     })

     arrayCarrito = []

    await modelUsers.updateOne({_id: perfil.id}, {$set:{cart: arrayCarrito}})
    
    res.status(200).send({status: "Success", message: "Correo enviado"})
    }

})

router.get('/borrarCarrito', async (req,res) => {

    const perfil = req.session.user

    const usuario = await modelUsers.findOne({_id: perfil.id})

    let arrayCarrito = usuario.cart

    if(arrayCarrito.length === 0){
        res.status(400).send({status: "Success", message: "No hay elementos para eliminar"})    
    } else {

    arrayCarrito = []

    await modelUsers.updateOne({_id: perfil.id}, {$set:{cart: arrayCarrito}})

    res.status(200).send({status: "Success", message: "Productos eliminados del carrito"})

    }

    

})

export default router