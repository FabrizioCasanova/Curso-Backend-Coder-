 const socket = io()

const botonDesloguearse = document.getElementById('botonDesloguearse')

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

 botonDesloguearse.addEventListener('click', async ()=> {

    const user = await fetch('api/sessions/user').then(result => result.json())

    Swal.fire({
        icon: 'success',
        title: `Hasta luego ${user.name}`
 }).then( async ()=>{

    await fetch('api/sessions/logout').then(result => result.json())
    window.location = 'api/form/login'
    
 })    
 })

