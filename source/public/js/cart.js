const botonFinalizarCompra = document.getElementById('botonFinalizarCompra')

botonFinalizarCompra.addEventListener('click', async ()  => {

    await fetch('../../api/carrito/email')

})