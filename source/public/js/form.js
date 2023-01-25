const socket = io()


const botonDesloguearse = document.getElementById('botonDesloguearse')
const productos = document.getElementById('productos')


socket.on('sendProducts', data => {

    let card = ''

    data.forEach((element, index) => {
        card +=
            `

        <div class="card" style="width: 18rem; margin-bottom: 2%;">
        <img src = ${element.imagen}  alt="Imagen de Producto">
  <div class="card-body">
    <h5 class="card-title">${element.nombre}</h5>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Marca: ${element.marca}</li>
    <li class="list-group-item">$${element.precio}</li>
    <li class="list-group-item">Stock: ${element.stock}</li>
  </ul>
  <div style="display: flex; justify-content: space-evenly; align-items: center;">
  <button id="botonRestarHome-${index}" type="submit">-</button>
  <p id="contador-${index}" style="margin-top: 1%">0</p>
  <button id="botonSumarHome-${index}" type="submit">+</button>
  <button id="botonAgregarCarrito-${index}" type="submit">Agregar al carrito</button>
  </div>
</div>
        
        `
    });

    productos.innerHTML = card

    data.forEach((elemento, indice) => {

        const botonRestarHome = document.getElementById(`botonRestarHome-${indice}`)
        const botonSumarHome = document.getElementById(`botonSumarHome-${indice}`)
        const contador = document.getElementById(`contador-${indice}`)
        const botonAgregarCarrito = document.getElementById(`botonAgregarCarrito-${indice}`) 

        botonRestarHome.addEventListener('click', async () => {
            if (parseInt(contador.innerText) > 0) {

                const numeroDeProductos = parseInt(contador.innerText) - 1
                contador.innerText = numeroDeProductos.toString()
            }

        })

        botonSumarHome.addEventListener('click', async () => {

            if (parseInt(contador.innerText) < elemento.stock) {
                const numeroDeProductos = parseInt(contador.innerText) + 1
                contador.innerText = numeroDeProductos.toString()
            }

        })

        if(parseInt(contador.innerText) === 0){
                console.log(0)
            
        } else {
            console.log(10)
        }

        botonAgregarCarrito.addEventListener('click', async ()=> {
            const card = data[indice]

            const orden = {

                id: card._id,
                titulo: card.nombre,
                precio: card.precio,
                cantidad: parseInt(contador.innerText),
                imagen: card.imagen

            }

            if(parseInt(contador.innerText) === 0){
                
                Swal.fire({
                    icon: 'error',
                    title: "Selecciona la cantidad de productos a comprar."
            })
            
            } else {
                fetch('api/carrito/cart', {
                    method: 'POST',
                    body: JSON.stringify(orden),
                    headers: {
                    'Content-Type': 'application/json'
                    }   
                })
    
                Swal.fire({
                    icon: 'success',
                    title: "Producto/s agregado/s a tu carrito."    
                }).then(async()=>{
                
                    window.location = '../../api/carrito/cart'
                
                })
            }


            
        })

    })
})


botonDesloguearse.addEventListener('click', async () => {

    const user = await fetch('api/sessions/user').then(result => result.json())

    if (!(user.status === "error")) {

        Swal.fire({
            icon: 'success',
            title: `Hasta luego ${user.name}`
        }).then(async () => {

            await fetch('api/sessions/logout').then(result => result.json())
            window.location = 'api/form/login'

        })

    } else {

        Swal.fire({
            icon: 'error',
            title: `Sesion de usuario inexistente`
        })

    }


})

