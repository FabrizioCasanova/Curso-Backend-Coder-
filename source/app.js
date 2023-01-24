import express from 'express'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import exportadoDeContendedores from './daos/config.js';
import router from './router/productos.router.js'
import routerSessions from './router/sessions.router.js';
import __dirname, { addLogger, infoPeticionRuta } from './utils.js';
import { Server } from 'socket.io';
import routerCarrito from './router/carrito.router.js';
import ContendedorMessageMongo from './daos/classMessagesMongo.js';
import { schema, normalize, denormalize } from "normalizr";
import passport from 'passport';
import initPassport from './config/passport.config.js';
import dotenv from './config/dotenv.js';
import {fork} from 'child_process'
import os from 'os';
import cluster from 'cluster';
import args from 'minimist';


const producto = new exportadoDeContendedores[0]('productos')
const messages = new ContendedorMessageMongo()

const app = express()

let server

const PORT = dotenv.app.PORT || 8080

//const server = app.listen(PORT, () => console.log('Estoy escuchando en express'))

const modulesCpus = os.cpus().length;

const argumentos = args(process.argv.slice(2), {
    default: {
        modo: "FORK"
    }
})

if(argumentos.modo === "CLUSTER"){

    console.log("Ejecutando el servidor en modo CLUSTER")

    if (cluster.isPrimary) {
    
        console.log(`El proceso primario con el PID ${process.pid} ha sido ejecutado`)
        
        for (let i = 0; i < modulesCpus; i++) {
            cluster.fork();
        }
        
        cluster.on('exit', (worker) =>{
            
            console.log(`El proceso con el PID ${worker.process.pid} dejo de funcionar `)
            
            cluster.fork();
        })
    
    } else {
    
        console.log(`El proceso worker con el PID ${process.pid} ha sido ejecutado`)
    
       server = app.listen(PORT,()=> console.log(` Escuchando en el puerto ${PORT}`))
    }

} else if (argumentos.modo === "FORK"){

    server = app.listen(PORT,()=> console.log(` Escuchando en el puerto ${PORT}`))

    console.log("Ejecutando servidor en modo FORK")
}

const io = new Server(server)

export default server

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
app.use(addLogger)
app.use(infoPeticionRuta)

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended: true })); // Habilita poder procesar y parsear datos más complejos en la url

app.get('/info', async (req,res) =>{
  res.render('info')
})

app.get('/api/random', async (req,res) => { 

  const {cant} = req.query

  
    const obj = {

    }

    for (let i = 1; i <= 1000; i++) {

        obj[i] = 0

    }

    if (cant!== undefined) {

        for (let i = 1; i <= cant; i++) {

            const numeroRandom = Math.floor(Math.random() * 1000 + 1)

            obj[numeroRandom]++

        }

    } else {

        for (let i = 1; i <= 100000000; i++) {

            const numeroRandom = Math.floor(Math.random() * 1000 + 1)

            obj[numeroRandom]++

        }

    }
    
    res.send(obj)

})

  // const processChild = fork(__dirname + '/calculoPesado.js')
  //processChild.send({cant})
  //processChild.on('message', object => {

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


app.get('/api/form/perfil', async (req,res) => {
  
  const perfil = req.session.user

if (perfil === undefined) {
    res.render("home")
} else 
{res.render("perfil", { perfil })}
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

app.all("*", (req, res)=> {
  req.logger.warn("Este metodo es inexistente para esta ruta")
  res.send({status: "error", error: "Error"})
}) 

router.get('/failedregister', (req,res) => {
  console.error('Error en el funcionamiento de Passport')
  res.status(500).send({status: "error", error: "Proceso de Passport fallido"})
})




  