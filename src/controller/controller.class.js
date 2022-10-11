'use strict'

const Store = require('../model/store.class');
const Product = require('../model/store.class');
const View = require('../view/view.class');

class Controller{

    constructor(){
        this.myStore = new Store(1, "Alamacén ACME");
        this.storeView = new View();
    }

    init(){
        this.myStore.init();
        this.storeView.init(this.myStore.categories, this.myStore.products);
        this.storeView.setTotalImport(this.myStore.totalImport());
    }


    addProductToStore(product){
        try{
            let newProduct = this.myStore.addProduct(product);
            this.storeView.renderProduct(newProduct);
            this.storeView.setTotalImport(this.myStore.totalImport());
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }

    addCategoryToStore(category){
        try{
            let newCategory = this.myStore.addCategory(category.name, category.description);
            this.storeView.renderCategory(newCategory);
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }

    deleteProductFromStore(id){
        try{
            this.myStore.delProduct(parseInt(id));
            this.storeView.deleteProduct(id);
            this.storeView.setTotalImport(this.myStore.totalImport());
        }catch(error){
            this.storeView.renderMessaje(error);
            this.storeView.delError();
        }
    }

    deleteCategoryFromStore(id){
        try{
            let category = this.myStore.delCategory(parseInt(id));
            this.storeView.deleteCategory(category);
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }
}

module.exports = Controller

