import express from 'express'
import exportadoDeContendedores from './daos/config.js';
import router from './router/productos.router.js'
import __dirname from './utils.js';
import { Server } from 'socket.io';
import routerCarrito from './router/carrito.router.js';
import ContendedorMessageMongo from './daos/classMessagesMongo.js';
import { schema, normalize, denormalize } from "normalizr";


const producto = new exportadoDeContendedores[0]('productos')
const messages = new ContendedorMessageMongo()



const app = express()

const server = app.listen(8080, () => console.log('Estoy escuchando en express'))
const io = new Server(server)

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended: true })); // Habilita poder procesar y parsear datos más complejos en la url
app.use('/', router)
app.use('/api/carrito', routerCarrito)

app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/api/form/chat', async (req,res)=>{
  res.render('formChat')
})

app.get('/api/messages/normalizr', async (req,res)=>{
    res.send(await funcionNormalizr())
})

async function funcionNormalizr() {
    
  let messagesJson = await messages.getAll()

  const usuario = new schema.Entity('usuario')
  const content = new schema.Entity('contenido', {
    author: usuario
  }, { idAttribute: "_id" })

  const todosLosMensajes = new schema.Entity('allMessages', {

    mensajes: [content]
  })

    const objetoANormalizar = {
      id: 'mensajes',
      mensajes: messagesJson
      
    }

    objetoANormalizar.mensajes =  JSON.stringify(objetoANormalizar.mensajes, null, "\t") 
    objetoANormalizar.mensajes = JSON.parse(objetoANormalizar.mensajes)

  const dataNormalizada = normalize(objetoANormalizar, todosLosMensajes)
  console.log(JSON.stringify(dataNormalizada, null, "\t") )
  return dataNormalizada

  const dataDenormalizada = denormalize(dataNormalizada.result, todosLosMensajes, dataNormalizada.entities)

}

io.on('connection', async socket => {

  const productJson = await producto.getAll()
  io.emit('sendProducts', productJson)


  // let messagesJson = await messages.getAll()
  // socket.emit('logs', messagesJson)


  socket.on('message', async data => {

    await messages.save(data)
    funcionNormalizr()

  })
})


 //socket.on('authenticated', data =>{
 //   socket.broadcast.emit('userConnected', data)
 //})
//})

