const form = document.getElementById('formRegisterUsers')

form.addEventListener('submit', async e => {
    e.preventDefault()
    const dataForm = new FormData(form)
    const objetoForm = {}
    dataForm.forEach((value, key) => objetoForm[key] = value)
    const response = await fetch('../sessions/register', {
        method: 'POST',
        body: JSON.stringify(objetoForm),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => result.json())

    if(response.status === "Success") {

        Swal.fire({
            icon: 'success',
            title: "Usuario Creado."

    })
    }
    
    form.reset()
})

