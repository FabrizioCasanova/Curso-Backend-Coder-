import { fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import winston from "winston";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

 export async function hashForPassword (password) {
    
    const genSalt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, genSalt)

} 

export async function validationOfPassword(user,password) {
   return bcrypt.compare(password,user.password)
}

// Configuracion de Logger //

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ 
            level: "info" 
        }),
        
        new winston.transports.File({ 
            level: "warn",
            filename: "./info/warn.log"
        }),

        new winston.transports.File({
            level: "error",
            filename: "./info/error.log"
        }),
    ]
})

export const addLogger = (req, res, next) => { 
    req.logger = logger;  
    next()
}

export const infoPeticionRuta = (req,res,next) => {
   req.logger.info(`Peticion a ruta: ${req.url} con el metodo ${req.method}`)
   next()
}

export default __dirname;
