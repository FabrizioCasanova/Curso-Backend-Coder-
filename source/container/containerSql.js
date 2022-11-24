import knex from "knex";

class ContainerOfSql {
    constructor(config,table){
        this.knex = knex(config)
        this.table = table
    }

    async readTableById(id){
        try{
            return this.knex.select("*").from(this.table).where("id", id) 
        } catch(error){
            console.error("Error con la lectura de la tabla indicada")
        }
    }

    async readAllTables(){
        try{
            return this.knex.select("*").from(this.table)
        } catch(error){
            console.error("Error con la lectura de las tablas")
        }
    }

    async saveElement(element){
        try{
            return this.knex.insert(element).into(this.table)
        } catch{
            console.error("Error al guardar este elemento")
        }
    }

    async updateElement(element,id){
        try{
            return this.knex.from(this.table).where('id', id).update(element)
        } catch{
            console.error("Error al actualizar este elemento")
        }
    }

    async deleteElementById(id){
        try{
            return this.knex.del().from(this.table).where('id', id)
        } catch{
            console.error("Error al eliminar este elemento")
        }
    }

    async deleteAllTables(){
        try{
            return this.knex.del().from(this.table)
        } catch {
            console.error('Error al eliminar la tabla')
        }
    }
}

export default ContainerOfSql