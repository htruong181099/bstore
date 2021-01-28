const db= require("../models");
const Shipping = db.shipping;

ships = [
    {
        name: "Giao hàng tiêu chuẩn",
        price: 15000,
        time: "2 - 4 ngày"
    },
    {
        name: "Giao hàng nhanh",
        price: 25000,
        time: "Trong vòng 1 ngày"
    }
]

module.exports = () =>{
    ships.forEach(e=>{
        let ship = new Shipping(e);
        ship.save((err)=>{
            console.log(err)
        })
    })
}