
const socket = io({
    autoConnect: true
})
// let user

// const buttonChat = document.getElementById('buttonChat')
// const placeholderChat = document.getElementById('placeholderChat')

// swal.fire({
//     title: "Nombre de usuario",
//     input: "text",
//     text: "Coloca el nombre de usuario que tendras en el chat",
//     inputValidator: (value) =>{
//         return !value && "¡Te falto rellenar el casillero!"
//     },
//     allowOutsideClick: false,
//     allowEscapeKey: false  
// }).then(result =>{
//     user = result.value
//     socket.connect()
//     socket.emit('authenticated', user)
// })

// placeholderChat.addEventListener('keyup', e =>{
//     if(e.key === "Enter"){
//         const holderValue = placeholderChat.value.trim()
//         if(holderValue.length>0){
//             socket.emit('message', {user, message: holderValue})
//             placeholderChat.value = ''
//         }
//     }
// })

// buttonChat.addEventListener('click', () =>{
 
//         const holderValue = placeholderChat.value.trim()
//         if(holderValue.length>0){
//          //   socket.emit('message', {author, id, nombre, apellido, edad, alias: user, avatar, text: holderValue})
//             placeholderChat.value = ''
//         }
// })

const chat = document.getElementById('chat')

chat.addEventListener('submit', (e) => {
    e.preventDefault();
    let chatModelo = {
        author : {
            id : chat[0].value,
            nombre : chat[1].value,
            apellido : chat[2].value,
            edad : chat[3].value,
            alias : chat[4].value,
            avatar : chat[5].value
        },
        text : chat[6].value
    }
    socket.emit('message',chatModelo);
    chat.reset()
})

// socket.on('logs', data =>{

//     const panelLog = document.getElementById('panelLog')
//     let message = ''

//     data.forEach ( msg =>{
//         message += `<p>  <span class = "nombreUser"> ${msg.user} dice: </span> ${msg.message} </p>`
//     })
    
//     panelLog.innerHTML = message
//     panelLog.scrollTop = panelLog.scrollHeight
// })   

// socket.on('userConnected', data =>{
//     swal.fire({
//         toast: true,
//         position: 'top-end',
//         showConfirmButton: false,
//         timer: 2000,
//         title: `${data} se ha unido al chat`,
//         icon:'success'
//     })
// })

