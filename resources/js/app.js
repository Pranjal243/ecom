import axios from 'axios'
import Noty from 'noty'
import { initAdmin} from './admin'
import moment from 'moment'
import { initStripe } from './stripe'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(item) {
    axios.post('/update-cart', item).then(res => {
        cartCounter.innerText = res.data.totalQty

        new Noty({
            type: 'success',
            text: 'Item added to card',
            timeout: 1000,
            progressBar: false,
            layout: 'centerRight'
        }).show();
    }).catch(err => {

        new Noty({
            type: 'error',
            text: 'Something went wrong',
            timeout: 1000,
            progressBar: false
        }).show(); 
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', () => {
        
        let item = JSON.parse(btn.dataset.item)
        updateCart(item)
    })
})

//Remove alert message (Order successfull)

const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout( () => {
        alertMsg.remove()
    },2000)
}

// Change order Status

let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ?  hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach( (status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach ((status) => {
        let dataProb = status.dataset.status
        if(stepCompleted) {
            status.classList.add('step-completed')
        }
        if(dataProb === order.status) {
            stepCompleted = false

            time.innerText = moment(order.updatteAt).format('hh:mm: A')
            status.appendChild(time)

            if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
        }
    }
})

}

updateStatus(order);

initStripe()

// Socket 
let socket = io()

initAdmin(socket)
// Join 
if(order) {
    socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})