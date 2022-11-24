import { Router } from "express";
import Contenedor from "../class.js";
import ContainerOfSql from "../container/containerSql.js";
import sqliteConfig from "../database/knex.js";

const container = new ContainerOfSql(sqliteConfig, 'productos')

const router = Router()

let administrador = false 

router.get('/', async (req,res)=>{
  res.render('home')
})

router.post('/form', async (req,res)=> {
    const datos = req.body
    await container.saveElement(datos)
   res.redirect('/')
})

router.get('/render', async (req,res)=>{
    const arrayProductos = await container.readAllTables()
    res.render('render', {arrayProductos})
})


router.get('/chat', (req,res)=>{
    res.render('chat')
})

router.get('/:id', async (req,res)=>{
    const {id} = req.params
    const arrayProductos = await container.readTableById(id)
    if(!(null == arrayProductos)){  
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
    await container.saveElement(objeto)
    res.send(objeto)

})

router.put('/:id', async (req,res)=>{

    const {id} = req.params;
    
    if(administrador === false ){
        return res.send({error: -1, descripcion: `Ruta: '/${id}', Metodo PUT no autorizado`})
    }
    
   
    let objeto = req.body;
    await container.updateElement(objeto, id)
    res.send(`Objeto con ID ${id} Actualizado`)
})

router.delete('/:id', async (req,res) =>{

    const {id} = req.params

    if(administrador === false ){
        return res.send({error: -1, descripcion: `Ruta: '/${id}', Metodo DELETE no autorizado`})
    }

    const arrayProductos = await container.readAllTables()
    const longitudArray = arrayProductos.length //previo a borrar el producto
    await container.deleteElementById(id)
    const newArrayProductos = await container.readAllTables()
    if(newArrayProductos.length < longitudArray){
        res.send(`objeto con ID ${id} eliminado`)
    } else {
        res.send('No se encontro el objeto')
    }
})



export default router