import { Console } from 'console'
import fs from 'fs'
import __dirname from './utils.js'

//Creacion de class y metodos
class Contenedor {
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo
    }

    save = async (object) => {
        
        let archivoExtraido = await this.getAll()
        let newId
    
        if(archivoExtraido.length == 0 ){
            newId = 1
        } else {
            newId = archivoExtraido[archivoExtraido.length-1].id + 1
        }

        object.id = newId

        archivoExtraido.push(object)
        archivoExtraido = JSON.stringify(archivoExtraido, null, '\t')
       await fs.promises.writeFile(`${__dirname}/${this.nombreArchivo}.json`, archivoExtraido)
       
       return newId
       
    }

    getAll = async () => {

        let archivoExtraido = []

        if(fs.existsSync(`${__dirname}/${this.nombreArchivo}.json`)){
    
            archivoExtraido = await fs.promises.readFile(`${__dirname}/${this.nombreArchivo}.json`, 'utf-8')
            archivoExtraido = JSON.parse(archivoExtraido)
        } 
        return archivoExtraido
    }

    getById = async (idObject) => {

        const array = await this.getAll()
        let res
        if(array.some(element => element.id == idObject)){
            res = array.filter(element => element.id == idObject)[0]
        } else {
            res = null
        }
        return res
    }

    deleteById = async (objectId) => {
        let indice
        let array = await this.getAll()
        for(let i=0; i<array.length; i++ ){
            if(array[i].id == objectId){
                 indice = i
                 array.splice(indice,1)
            }
        }
         array = JSON.stringify(array, null, '\t')
         await fs.promises.writeFile(`${__dirname}/${this.nombreArchivo}.json`, array)
    }

    deleteAll = async () => {
        if(fs.existsSync(`${__dirname}/${this.nombreArchivo}.json`)){
            await fs.promises.unlink(`${__dirname}/${this.nombreArchivo}.json`)
        }
    }

    updateFile = async (objeto, id) =>{
        
    let arrayProductos = await this.getAll()
    let newArrayProductos = arrayProductos.map(element => {
        if(element.id == id){
          return {...objeto, id: id}
        } else {
            return element
        }
    });
    
    newArrayProductos = JSON.stringify(newArrayProductos, null, '\t')
    await fs.promises.writeFile(`${__dirname}/${this.nombreArchivo}.json`, newArrayProductos)
}}

export default Contenedor 