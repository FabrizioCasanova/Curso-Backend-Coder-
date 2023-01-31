import Carrito from "../../models/carritoModel.js";
import RepositorioGenerico from "./repositorioGenerico.js";

export default class RepositorioCarrito extends RepositorioGenerico{
    constructor(dao){
        super(dao,Carrito.model)
    }
}