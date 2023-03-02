const botonDesloguearse = document.getElementById('botonDesloguearse')

botonDesloguearse.addEventListener('click', async () => {

    const user = await fetch('../../api/sessions/user').then(result => result.json())

    if (!(user.status === "error")) {

        Swal.fire({
            icon: 'success',
            title: `Hasta luego ${user.name}`
        }).then(async () => {

            await fetch('../../api/sessions/logout').then(result => result.json())
            window.location = '../../api/form/login'

        })

    } else {

        Swal.fire({
            icon: 'error',
            title: `Sesion de usuario inexistente`,
            footer: `Primero debe loguearse haciendo click <a style="margin-left: 5px;" href="api/form/login"> aqui </a>`
        })
    }
})