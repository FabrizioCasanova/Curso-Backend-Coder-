import { Router } from "express";
import { servicioProductos } from "../service/repositorios/servicios.js";

const router = Router()

let administrador = true 

router.get('/', async (req,res)=>{ 

    const perfil = req.session.user

  res.render('home', {perfil: perfil})
})

router.post('/form', async (req,res)=> {
    const datos = req.body
    await servicioProductos.save(datos)
   res.redirect('/')
})

router.get('/:id', async (req,res)=>{
    const {id} = req.params
    const object = await servicioProductos.getById(id)
    if(object != null){  
       res.send(object)
    } else if (req.url !== "/favicon.ico") { 
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

    const arrayProductos = await servicioProductos.getAll()
    const longitudArray = arrayProductos.length
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