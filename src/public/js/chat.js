const socket = io()

let user;
let chatBox = document.getElementById('chatBox')
let log = document.getElementById('messageLogs')

let data;

socket.on('message', (msg)=>{
    data = msg
})


socket.on('messageLogs', msgs=>{
    renderizar(msgs)
})

const renderizar = (msgs)=>{
    let messages = ''

    msgs.forEach(message => {
        const isCurrentUser = message.user === user
        const messageClass = isCurrentUser ? 'my-message' : ' other-message'
        messages = messages + `<div class='${messageClass}'>${message.user}: ${message.message}</div>`
    });

    log.innerHTML = messages
    chatBox.scrollIntroView(false)
}


Swal.fire({
    title: 'Indetificate',
    input: 'email',
    text: 'Ingresa un nombre de usuario',
    inputValidator: (value)=>{
        if(!value)
        return 'Necesitas escribir un nombre de usuario'
    },
    allowOutsideClick: false,
}).then(result =>{
    if(result.isConfirmed){
        user=result.value
        renderizar(data)
    }
})

chatBox.addEventListener('keyup', event =>{
    if(event.key==='Enter'){
        if(chatBox.value.trim().length > 0){
            const message = chatBox.value
            socket.emit('message', {user, message})
            chatBox.value='' 
        }
    }
})

socket.on('new_user', ()=>{
    Swal.fire({
        text: 'Un nuevo usuario se conecto',
        toast: true,
        position: 'top-center'
    })
})
