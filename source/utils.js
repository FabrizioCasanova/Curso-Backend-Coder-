import { fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

 export async function hashForPassword (password) {
    
    const genSalt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, genSalt)

} 

export async function validationOfPassword(user,password) {
   return bcrypt.compare(password,user.password)
}

export default __dirname;
