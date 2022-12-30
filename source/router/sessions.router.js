import { Router } from "express";
import passport from "passport";

const router = Router()

router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failedregister'}),  async (req, res) => {
    const user = req.user
    res.send({ status: "Success", mesagge: "Usuario Creado", payload: user._id })

})

router.get('/failedregister', (req,res) => {
    console.error('Error en el funcionamiento de Passport')
    res.status(500).send({status: "error", error: "Proceso de Passport fallido"})
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/failedlogin'}), async (req, res) => {


    req.session.user = {
        name: `${req.user.nombre} ${req.user.apellido}`,
        email: req.user.email,
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


// import { Router } from "express";
// import modelUsers from "../models/users.js";

// const router = Router()

// router.post('/register', async (req, res) => {

//     const { nombre, apellido, email, password } = req.body
//     if (!nombre || !apellido || !email || !password) return res.status(400).send({ status: "error", error: "Informacion no valida" })
//     const existUser = await modelUsers.findOne({ email })
//     if (existUser) return res.status(400).send({ status: "error", error: "Este usuario ya existe" })
//     const newUser = {
//         nombre,
//         apellido,
//         email,
//         password
//     }

//     const resultado = await modelUsers.create(newUser)
//     res.send({ status: "Success", mesagge: "Usuario Creado", payload: resultado._id })
// })

// router.post('/login', async (req, res) => {

//     const { email, password } = req.body
//     if (!email || !password) return res.status(400).send({ status: "error", error: "Datos Incompletos" })
//     const existUser = await modelUsers.findOne({ email, password })
//     if (!existUser) return res.status(400).send({ status: "error", error: "Correo o contraseña incorrecto/a" })
    
//     req.session.user = {
//         name: `${existUser.nombre} ${existUser.apellido}`,
//         email: existUser.email,
//         role: existUser.role
//     }

//     res.send({status: "Success", mesagge: " Ya estas logueado"})
// })

// router.get('/connected', (req,res) => {

//     if(req.session.user){
        
//         res.send({status: "Success", mesagge: "El usuario esta logueado"})

//     }

// })

// router.get('/user', (req,res) => {

//     res.send(req.session.user)

// })

// router.get('/logout',(req,res)=>{
//     req.session.destroy(err=>{
//         if(err) return res.status(500).send("No pude cerrar sesión")
//     })
//     res.send({status: "Success", mesagge: "Deslogueado!"})
// })

// export default router