import { Router } from "express";
import exportadoDeContendedores from "../daos/config.js";


const container = new exportadoDeContendedores[0]('productos') 

const router = Router()

let administrador = true 

router.get('/home', async (req,res)=>{ // esta es la ruta base original (cambiarla mas adelante)
  res.render('home')
})

router.post('/form', async (req,res)=> {
    const datos = req.body
    await container.save(datos)
   res.redirect('/')
})

router.get('/renderProducts', async (req,res)=>{
    const arrayProductos = await container.getAll()
    res.send({arrayProductos})
})


router.get('/chat', (req,res)=>{
    res.render('chat')
})


router.get('/:id', async (req,res)=>{
    const {id} = req.params
    const arrayProductos = await container.getById(id)
    if(arrayProductos != null){  
       res.send(arrayProductos)
    } else {
        res.send('Objeto no encontrado')
    }   
})

router.post('/', async (req, res) => {

    if(administrador === false ){
        return res.send({error: -1, descripcion: "Ruta: '/', Metodo POST no autorizado"})
    }

    const objeto = req.body;
    await container.save(objeto)
    res.send(objeto)

})

router.put('/:id', async (req,res)=>{

    const {id} = req.params;
    
    if(administrador === false ){
        return res.send({error: -1, descripcion: `Ruta: '/${id}', Metodo PUT no autorizado`})
    }
    
   
    let objeto = req.body;
    await container.updateFile(objeto, id)
    res.send(`Objeto con ID ${id} Actualizado`)
})

router.delete('/:id', async (req,res) =>{

    const {id} = req.params

    if(administrador === false ){
        return res.send({error: -1, descripcion: `Ruta: '/${id}', Metodo DELETE no autorizado`})
    }

    const arrayProductos = await container.getAll()
    const longitudArray = arrayProductos.length //previo a borrar el producto
    await container.deleteById(id)
    const newArrayProductos = await container.getAll()
    if(newArrayProductos.length < longitudArray){
        res.send(`objeto con ID ${id} eliminado`)
    } else {
        res.send('No se encontro el objeto')
    }
})



export default router