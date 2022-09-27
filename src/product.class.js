// Aquí la clase Product

class Product{
    constructor(id,name,category,price,units = 0){
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.units = units;
    }

    productImport(){
        return parseFloat(this.price * this.units);
    }

    toString(){
        return this.name + ": " + this.units + " uds. x " + this.price + " €/u = " + this.productImport().toFixed(2) + " €";
    }
}


module.exports = Product

