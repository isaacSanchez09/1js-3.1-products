'use strict'

const Store = require('../model/store.class');
const Product = require('../model/store.class');
const View = require('../view/view.class');
const formProduct = document.getElementById("new-prod");
const formCategory = document.getElementById("new-cat");

class Controller{

    constructor(){
        this.myStore = new Store(1, "Alamacén ACME");
        this.storeView = new View();
    }

    init(){
        this.myStore.init();
        this.storeView.init(this.myStore.categories, this.myStore.products, this.deleteProductFromStore.bind(this), this.addUnits.bind(this), this.delUnits.bind(this), this.addProductToStore.bind(this));
        this.storeView.setTotalImport(this.myStore.totalImport());
        this.storeView.initMenu();
    }


    addProductToStore(product){
        try{
            let newProduct = this.myStore.addProduct(product);
            this.storeView.renderProduct(newProduct, this.deleteProductFromStore.bind(this), this.addUnits.bind(this), this.addProductToStore.bind(this));
            formProduct.reset();
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }

    editProduct(product){
        try{
            let newProd = this.myStore.editProduct(product);
            this.storeView.editProduct(newProd);
            this.storeView.setTotalImport(this.myStore.totalImport());
            formProduct.reset();
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }

    addCategoryToStore(category){
        try{
            if(category.description === ""){
                category.description = undefined;
            }
            let newCategory = this.myStore.addCategory(category.name, category.description);
            this.storeView.renderCategory(newCategory);
            this.storeView.appendCategoryList(newCategory);
            formCategory.reset();
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }

    deleteProductFromStore(id){
        const product = this.myStore.getProductById(Number(id));
        if (!product) {
            this.storeView.renderErrorMessage('No hay ningún producto con id ' + id);
            return;
        }
        if (confirm(`Deseas borrar el producto "${product.name}" con id ${product.id}?`)) {
            if (product.units) {
                if (!confirm(`Ese producto aún tiene ${product.units} uds. que desaparecerán. Deseas continuar?`)) {
                    return;
                }
            }
            const prodDeleted = this.myStore.delProduct(Number(id));
            this.storeView.deleteProduct(id);
            this.storeView.setTotalImport(this.myStore.totalImport());
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
    
    addUnits(id){
        let producto = this.myStore.getProductById(id);
        producto.addUnits();
        this.storeView.editProduct(producto);
        this.storeView.setTotalImport(this.myStore.totalImport());
    }

    delUnits(id){
        let producto = this.myStore.getProductById(id);
        try{
            producto.delUnits();
            this.storeView.editProduct(producto);
            this.storeView.setTotalImport(this.myStore.totalImport());
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }
}

module.exports = Controller

