import passport from "passport";
import local from 'passport-local'
import { hashForPassword, validationOfPassword  } from "../utils.js";
import modelUsers from "../models/users.js";
import server from "../app.js";
import dotenv from "./dotenv.js";


const localStrategy = local.Strategy

function initPassport (){
    passport.use('register', new localStrategy({passReqToCallback: true, usernameField: 'email'}, async (req,email,password,done)=>{ 
       
        try{

    const { nombre, apellido} = req.body

    if (!nombre || !apellido) return done(null,false, {message: "Datos Incompletos"})  
    const existUser = await modelUsers.findOne({ email })

    if (existUser) return done(null,false, {message: "Usuario Existente"})  

    const passwordHashed = await hashForPassword(password)

    const newUser = {
        nombre,
        apellido,
        email,
        image: `${req.protocol}://${req.hostname}:${server.address().port}/images/${req.file.filename}`,
        password:passwordHashed
    }

    const resultado = await modelUsers.create(newUser)
    done(null, resultado)
        
    }catch(error){
        console.log(error)
        done(error)
    }
}))

    passport.use('login', new localStrategy({usernameField: 'email'}, async (email,password,done)=>{
        
try{

    if(email === dotenv.admin.MAIL){
        
        if(password === dotenv.admin.PASSWORD){
            
            const administrador = {
                _id : 156546814465,
                nombre : "Usuario",
                apellido : "Administrativo",
                email,
                password,
                image : 'https://thumbs.dreamstime.com/b/icono-de-administrador-vectorial-avatar-perfil-persona-usuario-masculino-con-rueda-engranaje-para-configuraci%C3%B3n-y-en-pictograma-150138136.jpg',
                role : 'admin'
            }

            done(null, administrador)

        } else {

            return done(null,false, {message: "Contraseña Incorrecta"})

        }

    } else {
    
        const existUser = await modelUsers.findOne({ email })

    if (!existUser) return done(null,false, {message: "Correo Incorrecto"})
    
    const passwordValid = await validationOfPassword(existUser,password)
    if(!passwordValid) return done(null,false, {message: "Contraseña Incorrecta"})
    
    done(null,existUser)
    }

}catch(error){

    done(error)

}

}))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    passport.deserializeUser(async(id,done)=>{
        let resultado = await modelUsers.findOne({_id:id})
        return done(null,resultado)
    })

} 

export default initPassport