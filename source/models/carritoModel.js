export default class Carrito {
    
    static get model(){
        return 'carrito'
    }

    static get schema(){
       return {
    
        timestamp: {
            type: String,
            require: true
    },

        carrito: {
            type: Array,
            require: true
    }
} 
}
}