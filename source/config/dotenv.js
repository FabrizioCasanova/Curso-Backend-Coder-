import dotenv from 'dotenv'

dotenv.config()

export default {

    app: {
        PORT : process.env.PORT
    },

    mongo: {
        USER : process.env.MONGO_USER,
        PASSWORD : process.env.MONGO_PASSWORD,
        DATABASE : process.env.MONGO_DB,
        SECRET: process.env.MONGO_SESSION_SECRET
    }
    

}