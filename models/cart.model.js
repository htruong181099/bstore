const Book = require("./book.model")

module.exports =  function Cart(initItems){
    this.items = initItems.items || [];
    this.totalQuantity = initItems.totalQuantity || 0;
    // this.totalAmount = initItems.totalAmount || 0;

    this.add = (item,id)=>{
        let storedItem = this.items;
        if(storedItem.findIndex(item=>item.id==id)===-1){
            storedItem.push({
                id,
                quantity: 0,
            })
        }
        const index = storedItem.findIndex(item=>item.id==id);
        if(storedItem[index].quantity==item.quantity){
            return false
        }
        storedItem[index].quantity++;
        this.totalQuantity++;
        return true;
    }

    //sync items when login
    this.addItems = (item,id,maxQuantity)=>{
        const index = this.items.findIndex(item=>item.id==id);
        
        let storedItem = this.items;
        if(index==-1){
            storedItem.push(item);
        }
        else{
            storedItem[index].quantity += item.quantity;

            if(storedItem[index].quantity >= maxQuantity){
                storedItem[index].quantity = maxQuantity;
            }
            
        }
        
        this.totalQuantity += item.quantity;
        return true;
    }
    
    this.reduceOne = (id) =>{
        const index = this.items.findIndex(item=>item.id==id);
        if(index == -1){
            return false
        }
        this.items[index].quantity--;
        this.totalQuantity--;
        if(this.items[index].quantity <= 0){
            this.items.splice(index,1); 
        }
        return true;
    }

    this.removeItem = (id)=>{
        const index = this.items.findIndex(item=>item.id==id);
        if(index == -1){
            return false
        }
        this.totalQuantity -= this.items[index].quantity;
        this.items.splice(index,1); 
        return true
    }

    this.getCart = async () =>{
        if(this.items.length == 0){
            return {
                items: [],
                totalQuantity: 0,
                totalAmount: 0
            }
        }
        const books = await Book.find({_id: {$in: this.items.map(item=>item.id)}});
        const items = this.items.map(item=>{
            const book = books.find(book=>book.id==item.id);
            return {
                id: item.id,
                item: {
                    title: book.title,
                    saleprice: book.saleprice,
                    coverimg : book.coverimg
                },
                quantity: item.quantity,
                amount: book.saleprice * item.quantity
            }
        });
        const totalAmount = (items.length!=1)?
                        items.reduce((t,item)=>t+item.amount,0):
                        items[0].amount;
        return {
            items,
            totalQuantity: this.totalQuantity,
            totalAmount
        }
    }
}