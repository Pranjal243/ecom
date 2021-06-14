import axios from 'axios'
import Noty from 'noty'
import { initAdmin} from './admin'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty

        new Noty({
            type: 'success',
            text: 'Item added to card',
            timeout: 1000,
            progressBar: false
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
        
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})

//Remove alert message (Order successfull)

const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout( () => {
        alertMsg.remove()
    },2000)
}

initAdmin()