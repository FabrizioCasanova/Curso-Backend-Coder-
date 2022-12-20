const form = document.getElementById('formLoginUsers')
const divLogin = document.getElementById('divLogin')

form.addEventListener('submit', async e => {
    e.preventDefault()
    const dataForm = new FormData(form)
    const objetoForm = {}
    dataForm.forEach((value, key) => objetoForm[key] = value)
    const response = await fetch('../sessions/login', {
        method: 'POST',
        body: JSON.stringify(objetoForm),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => result.json())

    if(response.status === "Success") {

     const user = await fetch('../sessions/user').then(result => result.json())

        Swal.fire({
            icon: 'success',
            title: `Bienvenido ${user.name}`
     })

    }

    form.reset()
})


