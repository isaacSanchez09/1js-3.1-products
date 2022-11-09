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

    async init(){
        this.initEsacuchadores();
        await this.myStore.init();
        this.storeView.init(this.myStore.categories, this.myStore.products, this.deleteProductFromStore.bind(this), this.addUnits.bind(this), this.delUnits.bind(this), this.deleteCategoryFromStore.bind(this));
        this.storeView.setTotalImport(this.myStore.totalImport());
        this.storeView.initMenu();
    }


    async addProductToStore(product){
        try{
            if(document.getElementById('new-prod').checkValidity()){
                let newProduct = await this.myStore.addProduct(product);
                this.storeView.renderProduct(newProduct, this.deleteProductFromStore.bind(this), this.addUnits.bind(this), this.addProductToStore.bind(this));
                formProduct.reset();
            }
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }

    async editProduct(product){
        try{
            if(document.getElementById('new-prod').checkValidity()){
                let newProd = await this.myStore.editProduct(product);
                this.storeView.editProduct(newProd);
                this.storeView.setTotalImport(this.myStore.totalImport());
                formProduct.reset();
            }
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }

    async addCategoryToStore(category){
        try{
            if(category.description === ""){
                category.description = undefined;
            }
            let newCategory = await this.myStore.addCategory(category.name, category.description);
            this.storeView.renderCategory(newCategory);
            this.storeView.appendCategoryList(newCategory, this.deleteCategoryFromStore.bind(this));
            formCategory.reset();
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }

    async deleteProductFromStore(id){
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
            try {
                await this.myStore.delProduct(Number(id));
                this.storeView.deleteProduct(id);
                this.storeView.setTotalImport(this.myStore.totalImport());
            } catch (error) {
                this.storeView.renderMessaje(error);
            }
        }
    }

    async deleteCategoryFromStore(id){
        let categoria = this.myStore.getCategoryById(id);
        if (!categoria) {
            this.storeView.renderErrorMessage('No hay ningúna categoria con id ' + id);
            return;
        }
        try{
            if (confirm(`Deseas borrar la categoria "${categoria.name}" con id ${categoria.id}?`)) {
                let categoryProds = this.myStore.getProductsByCategory(id);
                if (!categoryProds.length == 0) {
                    throw "Esta categoria no se puede borrar porque tiene productos";
                }
                try {
                    await this.myStore.delCategory(id);
                    this.storeView.deleteCategory(id, this.deleteCategoryFromStore.bind(this));
                } catch (error) {
                    this.storeView.renderMessaje(error);
                }
            }
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }
    
    async addUnits(id){
        let producto = this.myStore.getProductById(id);
        producto.addUnits();
        producto = await this.myStore.editProduct(producto);
        this.storeView.editProduct(producto);
        this.storeView.setTotalImport(this.myStore.totalImport());
    }

    async delUnits(id){
        let producto = this.myStore.getProductById(id);
        try{
            producto.delUnits();
            producto = await this.myStore.editProduct(producto);
            this.storeView.editProduct(producto);
            this.storeView.setTotalImport(this.myStore.totalImport());
        }catch(error){
            this.storeView.renderMessaje(error);
        }
    }

    initEsacuchadores(){

        const inputName = document.getElementById("newprod-name");
        const inputId = document.getElementById("newprod-id");
        inputName.addEventListener("blur", () => {
            if (this.myStore.productNameExist(inputName.value, inputId.value)) {
                inputName.setCustomValidity("El producto ya existe")
            }else{
                inputName.setCustomValidity("")
            }
            inputName.nextElementSibling.textContent = inputName.validationMessage
        })

        const inputCat = document.getElementById("categorias");
        inputCat.addEventListener("blur", () => {
            inputCat.nextElementSibling.textContent = inputCat.validationMessage
        })

        const inputUnits = document.getElementById("newprod-units");
        inputUnits.addEventListener("blur", () => {
            inputUnits.nextElementSibling.textContent = inputUnits.validationMessage
        })

        const inputPrice = document.getElementById("newprod-price");
        inputPrice.addEventListener("blur", () => {
            inputPrice.nextElementSibling.textContent = inputPrice.validationMessage
        })

        document.getElementById('new-prod').addEventListener('submit', (event) => {
            event.preventDefault();
              
            inputName.nextElementSibling.textContent = inputName.validationMessage
            inputCat.nextElementSibling.textContent = inputCat.validationMessage
            inputUnits.nextElementSibling.textContent = inputUnits.validationMessage
            inputPrice.nextElementSibling.textContent = inputUnits.validationMessage

            if(document.getElementById('new-prod').checkValidity()){
                const name = document.getElementById('newprod-name').value
                const price = document.getElementById('newprod-price').value
                const category = document.getElementById('categorias').value 
                const units = document.getElementById('newprod-units').value 
                const id = document.getElementById('newprod-id').value
                if(id){
                    this.editProduct({ id: parseInt(id), name: name, price: Number(price), category: parseInt(category), units: parseInt(units) })   
                }else{
                    this.addProductToStore({ name: name, price: Number(price), category: parseInt(category),units:parseInt(units) })   
                }
            }
        })

        window.addEventListener('load', () => {
            document.getElementById('new-cat').addEventListener('submit', (event) => {
              event.preventDefault()
              const nameCategory = document.getElementById('newcategory-name').value
              const description = document.getElementById('newcategory-description').value
              this.addCategoryToStore({ name: nameCategory, description: description})   
            })
          
            document.getElementById('del-cat').addEventListener('submit', (event) => {
              event.preventDefault()
          
              this.deleteCategoryFromStore(document.getElementById('delcat-id').value)      
            })
        })
    }   
}

module.exports = Controller

