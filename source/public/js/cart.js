const botonFinalizarCompra = document.getElementById('botonFinalizarCompra')
const botonEliminarProductosCarrito = document.getElementById('botonEliminarProductosCarrito')

botonFinalizarCompra.addEventListener('click', async (e)  => {

    const response = await fetch('../../api/carrito/email')

    if(response.status === 400){
        
        Swal.fire({
            icon: 'error',
            title: "No hay elementos en el carrito."    
        }).then(async()=> {

            window.location = '/'

        })  

      } else {

        Swal.fire({
            icon: 'success',
            title: "Compra Realizada. Te enviamos un mail con tu respectivo recibo."    
        }).then(async()=>{
        
         location.reload()

      })} 
})

botonEliminarProductosCarrito.addEventListener('click', async () => {

  const response = await fetch('../../api/carrito/borrarCarrito')

    if(response.status === 400){
        
        Swal.fire({
            icon: 'error',
            title: "No hay productos en el carrito."    
        }).then(async()=> {
            window.location = '/'
        })
        
       
    
      } else {

          Swal.fire({
          icon: 'info',
          confirmButtonColor: 'red',
          confirmButtonText: 'Eliminar',
          title: "Se eliminaran todos los productos del carrito."    
      }).then(async()=> {
        location.reload()
      })
        
      } 
})
