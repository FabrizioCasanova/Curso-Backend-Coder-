export default class UsuarioDto{
    static userDatabase = (user) => {
        return {
                name: `${user.nombre} ${user.apellido}`,
                email: user.email,
                image: user.image,
                id: user._id,
                role: user.role,
                username: user.username || "usuario"
            }
        }

        static userPresent = (user) => {
            return {
                    name: `${user.nombre} ${user.apellido}`,
                    email: user.email,
                    image: user.image,
                    username: user.username || "usuario"
                }
            }
    }


