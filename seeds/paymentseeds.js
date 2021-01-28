const db = require("../models");
const Payment = db.payment;

let payments = [
    "Thanh toán bẳng tiền khi nhận hàng", "MomoPay Vallet"
]

module.exports = () =>{
    payments.forEach(e=>{
        let payment = new Payment({name:e});
        payment.save((err)=>{
            console.log(err);
        })
    })
}
