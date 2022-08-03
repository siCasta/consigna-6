function $(query) {
    return document.querySelector(query)
}

const socket = io()
const user = await Swal.fire({
    title: 'Registrate',
    text: 'Ingresa tu email',
    input: 'text',
    inputValidator: (value) => {
        return !value && 'Nesesitas escribir tu email!'
    },
    allowOutsideClick: false,
    confirmButtonText: 'Enter',
    allowEscapeKey: false,
}).then(result => {
    socket.connect()
    socket.emit('connected', result.value)
    return result.value
})
const inputDefaultURL = $('#thumbnail')

inputDefaultURL.placeholder = 'Loading...'
inputDefaultURL.disabled = true

fetch('https://picsum.photos/1000').then(response => {
    inputDefaultURL.value = response.url
    inputDefaultURL.disabled = false
})

const form = $('#form')

form.addEventListener('submit', async e => {
    e.preventDefault()

    const data = {}
    const formData = new FormData(form)

    formData.forEach((value, key) => {
        data[key] = value
    })

    data.price = parseInt(data.price)

    const response = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        const data = await response.json()

        inputDefaultURL.placeholder = 'Loading...'
        inputDefaultURL.disabled = true

        fetch('https://picsum.photos/1000').then(response => {
            inputDefaultURL.value = response.url
            inputDefaultURL.disabled = false
        })

        e.target.reset()

        socket.emit('create', true)

        Swal.fire({
            title: 'Producto creado',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        })

    } else {
        const error = await response.json()

        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
    }
})

socket.on('products', data => {
    const table = $('#products')
    if (data <= 0) {
        table.innerHTML = '<tr><td colspan="4">No hay productos</td></tr>'
    } else {
        let products = ''
        data.forEach(product => {
            products += `<tr>
                <td class="align-middle">${product.title}</td>
                <td class="align-middle">${product.price}</td>
                <td class="align-middle">
                    <img src="${product.thumbnail}" alt="${product.title}" class="img-fluid rounded-4" width="200">
                </td>
            </tr>`
        })
        table.innerHTML = products
    }
})

socket.on('created', data => {
    Toastify({
        text: data,
        duration: 3000,
        stopOnFocus: true,
        gravity: 'top',
        close: true,
    }).showToast()
})

const chatinput = $('#chatinput')

chatinput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (chatinput.value.trim().length > 0) {
            socket.emit('message', {
                user,
                message: chatinput.value,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            })
            chatinput.value = ''
        }
    }
})

socket.on('log', data => {
    const chat = $('#chat')
    let messages = ''
    data.forEach(message => {
        messages += `<div class="text-light">
            <span class="${message.user === user ? 'text-primary' : 'text-warning'}"><strong>${message.user}</strong></span>
            <span class="text-secondary">[${message.date} ${message.time}]</span>
            <span class="text-light">: ${message.message}</span>
        </div>`
    })

    chat.innerHTML = messages
    chat.scrollTop = chat.scrollHeight + 100
})