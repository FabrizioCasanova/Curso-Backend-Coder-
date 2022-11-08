import { Router } from "express";
import Contenedor from "../class.js";

const container = new Contenedor('archivodeprueba')

const router = Router()

router.get('/', async (req,res)=>{
  res.render('home')
})

// router.get('/:id', async (req,res)=>{
//     const {id} = req.params
//     const arrayProductos = await container.getById(id)
//     if(!(null == arrayProductos)){  
//        res.send(arrayProductos)
//     } else {
//         res.send('Objeto no encontrado')
//     }   
// })

router.post('/', async (req, res) => {
    const objeto = req.body;
    await container.save(objeto)
    res.send(objeto)
})

router.put('/:id', async (req,res)=>{
    
    const {id} = req.params;
    let objeto = req.body;
    await container.updateFile(objeto, id)
    res.send("Objeto Actualizado")
})

router.delete('/:id', async (req,res) =>{
    const arrayProductos = await container.getAll()
    const longitudArray = arrayProductos.length //previo a borrar el producto
    const {id} = req.params
    await container.deleteById(id)
    const newArrayProductos = await container.getAll()
    if(newArrayProductos.length < longitudArray){
        res.send('objeto eliminado')
    } else {
        res.send('No se encontro el objeto')
    }
})

router.post('/form', async (req,res)=> {
    const datos = req.body
    await container.save(datos)
   res.redirect('/')
})

router.get('/render', async (req,res)=>{
    const arrayProductos = await container.getAll()
    res.render( 'render' , {arrayProductos})
})

export default router