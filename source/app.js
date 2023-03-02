import express from 'express'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { servicioProductos } from './service/repositorios/servicios.js';
import router from './router/productos.router.js'
import routerSessions from './router/sessions.router.js';
import __dirname, { addLogger, infoPeticionRuta } from './utils.js';
import { Server } from 'socket.io';
import routerCarrito from './router/carrito.router.js';
import passport from 'passport';
import initPassport from './config/passport.config.js';
import dotenv from './config/dotenv.js';
import os from 'os';
import cluster from 'cluster';
import args from 'minimist';

const app = express()

let server

const PORT = dotenv.app.PORT || 8080

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

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

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

app.get('/api/form/errorPage', async (req,res)=> {
  res.render('errorPage')
})

app.get('/api/form/errorAdminPage', async (req,res)=> {
  res.render('errorAdminPage')
})

app.get('/api/form/perfil', async (req,res) => {
  
  const perfil = req.session.user

if (perfil === undefined) {
    res.redirect('/api/form/errorPage')
} else 
{res.render("perfil", { perfil })}
})

io.on('connection', async (req,res) => {

  const productJson = await servicioProductos.getAll()
  io.emit('sendProducts', productJson)

})

app.all("*", (req, res)=> {
  req.logger.warn(`Este metodo es inexistente para esta ruta ${req.url} | Metodo ${req.method} `)
  res.send({status: "error", error: "Error"})
}) 

router.get('/failedregister', (req,res) => {
  console.error('Error en el funcionamiento de Passport')
  res.status(500).send({status: "error", error: "Proceso de Passport fallido"})
})




  