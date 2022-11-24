import knex from "knex";
import __dirname from "../utils.js";

const sqliteConfig = {
    client: "sqlite3",
    connection:{
        filename: __dirname + "/database/ecommerce.sqlite"
    },
    useNullAsDefault: true
}

const database = knex(sqliteConfig)

try{   
    let existTable = await database.schema.hasTable("productos")
    if(!existTable){
        await database.schema.createTable("productos", table => {
            table.primary('id')
            table.increments('id')
            table.string('nombre', 35).notNullable()
            table.string('marca', 20).notNullable()
            table.float("precio").notNullable()
            table.string("imagen", 1000)
        })
    }
} catch(error){
    console.error("Ocurrio un fallo en la tabla de productos");
}

try{   
    let existTable = await database.schema.hasTable("mensajes")
    if(!existTable){
        await database.schema.createTable("mensajes", table => {
            table.primary('id')
            table.increments('id')
            table.string('user', 35)
            table.string('message', 100)
            table.string('date', 50)
        })
    }
} catch(error){
    console.error("Ocurrio un fallo en la tabla de mensajes");
}

export default sqliteConfig