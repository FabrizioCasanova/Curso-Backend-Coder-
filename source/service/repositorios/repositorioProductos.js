import Productos from "../../models/productModel.js";
import RepositorioGenerico from "./repositorioGenerico.js";

export default class RepositorioProductos extends RepositorioGenerico{
    constructor(dao){
        super(dao,Productos.model)
    }
}