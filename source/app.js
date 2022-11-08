import express from 'express'
import Contenedor from './class.js'
import router from './router/productos.router.js'
import __dirname from './utils.js';


const producto = new Contenedor('archivodeprueba')

//  producto.save({
//     nombre: 'Heladera',
//     precio: 150000,
//     marca: 'samsung'
// }).then(()=> producto.save({
//      nombre: 'Monitor',
//     precio: 45000,
//      marca: 'LG'
//  })) 

const app = express()

const server = app.listen(8080,()=> console.log('Estoy escuchando en express'))

app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// app.get('/productos', async (req,res)=>{
//     const arrayProductos = await producto.getAll()
//     res.send(arrayProductos)
// })


// app.get('/productoRandom', async (req,res)=>{
//     const arrayProductos = await producto.getAll()
//     const indiceRandom = parseInt(Math.random()*arrayProductos.length) 
//     res.send(arrayProductos[indiceRandom])
// })

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended:true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use('/', router )