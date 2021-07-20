import axios from 'axios'
import Noty from 'noty'

export function placeOrder(formObject) {
    axios.post('/orders', formObject).then((res)=> {
        new Noty({
            type: 'success',
            text: res.data.message,
            timeout: 1000,
            progressBar: false,
            layout: 'centerRight'
        }).show();
        setTimeout(()=>{
            window.location.href='/customer/orders';
        },1000);
        
    }).catch((err)=> {
        new Noty({
            type: 'error',
            text: err.res.data.message,
            timeout: 1000,
            progressBar: false
        }).show();
    })
}