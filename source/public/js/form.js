 const socket = io()

const productos = document.getElementById('productos')

 socket.on('sendProducts', data =>{
    
    let card = ''
    
    data.forEach(element => {
        card +=
        `
        <img src = ${element.imagen}  alt="Imagen de Producto">
        <p> ${element.nombre} </p>
        <p> ${element.marca}  </p>
        <p> ${element.precio} </p>
        `
     });

     productos.innerHTML = card
 })


