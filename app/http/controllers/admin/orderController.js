const Order = require('../../../models/order')
const order = require('../../../models/order')


function orderController() {
    return {
        order_display(req,res) {
            order.find({ status:{ $ne: 'completed'}}, null, { sort: { 'createdAt':-1}}).
            populate('customerId', '-password').exec((err, orders)=> {

                if(req.xhr) {
                    return res.json(orders)
                } else {
                    res.render('admin/orders')
                }
            })
        }
    }
}

module.exports = orderController