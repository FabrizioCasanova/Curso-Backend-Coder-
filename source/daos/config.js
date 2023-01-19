import mongoose from 'mongoose'
import Contenedor from './class.js'
import contenedorCarrito from './classCart.js'
import ContendedorMongo from './classMongo.js'
import contenedorCarritoMongo from './classCartMongo.js'

const persistencia = "fs" // Puede cambiar a fs // 
let exportadoDeContendedores

if( persistencia === "mongo"){
    
    const connection = mongoose.connect('mongodb+srv://DataBaseCoder:6xjrrip30r3RbqCT@codercluster.vgx1dq2.mongodb.net/DatabaseMongo?retryWrites=true&w=majority', error => {
        if(error){
            console.log(error)
        }else {
            console.log('Base de mongo conectada. Cambiar la persistencia a "fs" para usar filesystem')
        }
    })    

    exportadoDeContendedores = [ContendedorMongo, contenedorCarritoMongo]
    
} else if ( persistencia === "fs" ) {

    console.log('Conectado a FileSyistem. Cambiar la persistencia a "mongo" para usar mongoose')
    exportadoDeContendedores = [Contenedor, contenedorCarrito]

} else {
    console.error("Base de datos no valida")
}

export default exportadoDeContendedores