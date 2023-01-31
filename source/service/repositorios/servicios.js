import RepositorioCarrito from "./repositorioCarrito.js";
import RepositorioProductos from "./repositorioProductos.js";
import DaoCentralizado from "../../daos/daoCentralizado.js";

const daoCentralizado = new DaoCentralizado()

export const servicioProductos = new RepositorioProductos(daoCentralizado)
export const servicioCarrito = new RepositorioCarrito(daoCentralizado)