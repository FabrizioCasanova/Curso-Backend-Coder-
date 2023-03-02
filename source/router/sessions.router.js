import { Router } from "express";
import passport from "passport";
import uploader from "../service/upload.js";

const router = Router()

router.post('/register', uploader.single("image"), passport.authenticate('register', {failureRedirect: '/api/sessions/failedregister'}),  async (req, res) => {
    const user = req.user
    res.send({ status: "Success", mesagge: "Usuario Creado", payload: user._id })

})

router.get('/failedregister', (req,res) => {
    console.error('Error en el funcionamiento de Passport')
    res.status(500).send({status: "error", error: "Proceso de Passport fallido"})
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/failedlogin'}), async (req, res) => {

    console.log(req.user)

    req.session.user = {
        name: `${req.user.nombre} ${req.user.apellido}`,
        email: req.user.email,
        image: req.user.image,
        id: req.user._id,
        role: req.user.role
    }
    
    res.send({status: "Success", mesagge: " Ya estas logueado"})
})

router.get('/failedlogin', (req,res) => {
    console.error('Error en el funcionamiento de Passport')
    res.status(500).send({status: "error", error: "Proceso de Passport fallido"})
})

router.get('/connected', (req,res) => {

    if(req.session.user){
        
        res.send({status: "Success", mesagge: "El usuario esta logueado"})

    }

})

router.get('/user', (req,res) => {

    if(!(req.session.user)){

        res.send({status: "error", mesagge: "Sesion Inexistente"})

    } else {
        res.send(req.session.user)
    }
    

})

router.get('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.status(500).send("No pude cerrar sesión")
    })
    res.send({status: "Success", mesagge: "Deslogueado!"})
})

export default router