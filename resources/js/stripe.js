import { loadStripe } from '@stripe/stripe-js'
import { placeOrder } from './apiService';
import { CardWidget } from './CardWidget'

export async function initStripe() {
    const stripe = await loadStripe('pk_test_51J6JfxSFTAFOdY8x2jZ6mLLiePt19MEHsUAY3sjL7GuBHdynU3qBWgyhLwSuL67gMFzaaYAR5yntprGbHwcW8Frr00PzGcaEMK');

    let card=null

    // card = elements.create('card', {style, hidePostalCode:true})
    // card.mount('#cardElement')
    // }

    const paymentType = document.querySelector('#paymentType');
    if(!paymentType)
    return;

    paymentType.addEventListener('change', (e) => {
        if(e.target.value === 'card')
        {
            //mountWidget();
            card = new CardWidget(stripe)
            card.mount()
        } else {
            card.destroy();
        }
    })
    // Ajax call
    const paymentForm = document.querySelector('#payment-form');
    if(paymentForm)
    {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let formData = new FormData(paymentForm);
            let formObject = {}
        
            for(let [key,value] of formData.entries()){
                formObject[key]=value
            }
        
            if(!card) {
                placeOrder(formObject);
                return;
            }

            const token = await card.createToken()
            formObject.stripeToken = token.id;
            placeOrder(formObject);
            //Verify Card
            // stripe.createToken(card).then( (result) => {
            //     formObject.stripeToken = result.token.id;
            //     placeOrder(formObject);
            // }).catch((err) => {

            // })
        })

    }


}