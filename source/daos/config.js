import mongoose from 'mongoose'
import Contenedor from './class.js'
import contenedorCarrito from './classCart.js'
import ContendedorMongo from './classMongo.js'
import contenedorCarritoMongo from './classCartMongo.js'

const persistencia = "Fs" // Puede cambiar a fs // 
let exportadoDeContendedores

if( persistencia === "Mongo"){
    
    const connection = mongoose.connect('mongodb+srv://DataBaseCoder:6xjrrip30r3RbqCT@codercluster.vgx1dq2.mongodb.net/DatabaseMongo?retryWrites=true&w=majority', error => {
        if(error){
            console.log(error)
        }else {
            console.log('Base de mongo conectada')
        }
    })    

    exportadoDeContendedores = [ContendedorMongo, contenedorCarritoMongo]
    
} else if ( persistencia === "Fs" ) {

    console.log("Conectado a FileSyistem")
    exportadoDeContendedores = [Contenedor, contenedorCarrito]

} else {
    console.error("Base de datos no valida")
}

export default exportadoDeContendedores