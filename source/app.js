import express from 'express'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import exportadoDeContendedores from './daos/config.js';
import router from './router/productos.router.js'
import routerSessions from './router/sessions.router.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import routerCarrito from './router/carrito.router.js';
import ContendedorMessageMongo from './daos/classMessagesMongo.js';
import { schema, normalize, denormalize } from "normalizr";
import passport from 'passport';
import initPassport from './config/passport.config.js';
import dotenv from './config/dotenv.js';
import {fork} from 'child_process'

const producto = new exportadoDeContendedores[0]('productos')
const messages = new ContendedorMessageMongo()

const app = express()

const PORT = dotenv.app.PORT


const server = app.listen(PORT, () => console.log('Estoy escuchando en express'))
const io = new Server(server)

app.use(session({
  store: MongoStore.create({
      mongoUrl: `mongodb+srv://${dotenv.mongo.USER}:${dotenv.mongo.PASSWORD}@codercluster.vgx1dq2.mongodb.net/${dotenv.mongo.DATABASE}?retryWrites=true&w=majority`,
      ttl: 60*60*24*7
    
    }), 
  secret: dotenv.mongo.SECRET,
  resave: false,
  saveUninitialized:false
}))

initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended: true })); // Habilita poder procesar y parsear datos más complejos en la url

app.get('/info', async (req,res) =>{
  res.render('info')
})

app.get('/', async (req,res) => { //esta ruta es '/api/random', cambiarla mas adelante.

  const {cant} = req.query

  const processChild = fork(__dirname + '/calculoPesado.js')
  processChild.send({cant})
  processChild.on('message', object => {

    res.send(object)

  })

})

app.use('/', router)
app.use('/api/carrito', routerCarrito)
app.use('/api/sessions', routerSessions )

app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')


app.get('/api/form/register', async (req,res) =>{
  res.render('register')
})

app.get('/api/form/login', async (req,res) =>{
  res.render('login')
})

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

  socket.on('message', async data => {

    await messages.save(data)
    funcionNormalizr()

  })
})