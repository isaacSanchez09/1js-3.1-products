'use strict'

const Category = require("../model/category.class");
const Product = require("../model/product.class");


class View{
    
    init(categories, products){
        this.initCategories(categories);
        this.initProducts(products);
    }

    renderCategory(category){
        const opcionesCategorias = document.getElementById('categorias');
        let nuevaOption = this.appendCategory(category);
        opcionesCategorias.appendChild(nuevaOption);
    }

    renderProduct(product){
        let productos = document.getElementById('listaProductos');
        let nuevoProducto = document.createElement('tr');
        nuevoProducto.id = `producto${product.id}`
        nuevoProducto.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.units}</td>
        <td>${product.price} €/u</td>
        <td>${product.productImport()}</td>`
        productos.appendChild(nuevoProducto);
    }

    deleteProduct(id){
        let productos = document.getElementById('listaProductos');
        productos.removeChild(document.getElementById(`producto${id}`))
    }

    renderMessaje(mensajeEror){
        let error = document.getElementById('messages');
        error.innerHTML =`
        <div class="alert alert-danger alert-dismissible" role="alert">
        ${mensajeEror}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="this.parentElement.remove()"></button>
      </div>`
    }

    initCategories(categories){
        const opcionesCategorias = document.getElementById('categorias');
        categories.forEach(category =>{
            let newOption = this.appendCategory(category);
            opcionesCategorias.appendChild(newOption);
        })
    }

    deleteCategory(categories){
        const opcionesCategorias = document.getElementById('categorias');
        let option = document.getElementById(`category${categories.id}`);
        opcionesCategorias.removeChild(option);
    }

    setTotalImport(totalImport){
        let importe = document.getElementById('importeTotal');
        importe.textContent = totalImport;
    }

    initProducts(products){
        const listaProductos = document.getElementById('listaProductos')
        products.forEach(product =>{
            let nuevoProducto = document.createElement('tr');
            nuevoProducto.id = `producto${product.id}`
            nuevoProducto.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.units}</td>
            <td>${product.price} €/u</td>
            <td>${product.productImport()}</td>`
            listaProductos.appendChild(nuevoProducto);
        })
    }

    appendCategory(category){
        let nuevaOption = document.createElement('option');
        nuevaOption.id = "category" + category.id;
        nuevaOption.value = category.id
        nuevaOption.label = category.name;
        return nuevaOption;
    }
}

module.exports = View
