import { Router } from "express";
// import exportadoDeContendedores from "../daos/config.js";
import { servicioProductos } from "../service/repositorios/servicios.js";


// const container = new exportadoDeContendedores[0]('productos') 

const router = Router()

let administrador = true 

router.get('/', async (req,res)=>{ 
  res.render('home')
})

router.post('/form', async (req,res)=> {
    const datos = req.body
    await servicioProductos.save(datos)
   res.redirect('/')
})

router.get('/renderProducts', async (req,res)=>{
    const arrayProductos = await servicioProductos.getAll()
    res.send({arrayProductos})
})


router.get('/chat', (req,res)=>{
    res.render('chat')
})


router.get('/:id', async (req,res)=>{
    const {id} = req.params
    const object = await servicioProductos.getById(id)
    if(object != null){  
       res.send(object)
    } else if (req.url !== "/favicon.ico") { // Parche momentaneo de favicon (borrarlo mas adelante)
        req.logger.error("Objeto no encontrado")
        res.send('Objeto no encontrado')
        
    }   
})

router.post('/', async (req, res) => {

    if(administrador === false ){
        req.logger.error("Ruta: '/', Metodo POST no autorizado")
        return res.send({error: -1, descripcion: "Ruta: '/', Metodo POST no autorizado"})
    }

    const objeto = req.body;
    await servicioProductos.save(objeto)
    res.send(objeto)

})

router.delete('/:id', async (req,res) =>{

    const {id} = req.params

    if(administrador === false ){
        req.logger.error(`Ruta: '/${id}', Metodo DELETE no autorizado`)
        return res.send({error: -1, descripcion: `Ruta: '/${id}', Metodo DELETE no autorizado`})
    }

    const arrayProductos = await servicioProductosy.getAll()
    const longitudArray = arrayProductos.length //previo a borrar el producto
    await servicioProductos.deleteById(id)
    const newArrayProductos = await servicioProductos.getAll()
    if(newArrayProductos.length < longitudArray){
        res.send(`objeto con ID ${id} eliminado`)
    } else {
        req.logger.error("No se encontro el objeto")
        res.send('No se encontro el objeto')
    }
})



export default router