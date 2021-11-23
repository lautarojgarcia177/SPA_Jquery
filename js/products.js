
class Product {
    constructor(data) {
        this.id = data.id
        this.name = data.name.toUpperCase();
        this.price = parseFloat(data.price);
        this.sold = false;
    }
    addCustoms() {
        this.price = this.price * 1.21;
    }
    sell() {
        this.sold = true;
    }
}

class ProductModel {
    constructor() {
        //WE OBTAIN THE ARRAY OF PRODUCTS PARKING FROM THE JSON IF IT EXISTS
        const products = JSON.parse(localStorage.getItem('products')) || [];
        //WE USE MAP TO CREATE A NEW ARRAY OF PRODUCT TYPE OBJECTS
        this.products = products.map(product => new Product(product));
    }
    //METHOD TO SAVE THE ARRAY OF PRODUCTS IN STORAGE
    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }
    //METHOD TO ADD A PRODUCT TO THE PRODUCT ARRAY
    addProduct(product) {
        this.products.push(new Product(product));
        this.saveProducts();
    }
    //METHOD TO DELETE A PRODUCT FROM THE PRODUCT ARRAY
    deleteProduct(id) {
        this.products = this.products.filter(product => product.id !== id);
        this.saveProducts();
    }
    //METHOD TO FIND A PRODUCT IN THE PRODUCT ARRAY
    searchProduct(id) {
        return this.products.find(product => product.id === id);
    }
}

class ProductView {
    //METHOD TO CREATE THE ADD PRODUCT VIEW
    addProduct(parent, callback) {
        $(parent).html(`
            <section>
                <h1>ADD PRODUCT</h1>
                <input type ="text"   placeholder="Name">
                <input type ="number" placeholder="Price">
                <button id="btnSend">SEND</button>
            </section>
        `);
        $("#btnSend").click(callback);
    }
    //METHOD FOR CREATING THE PRODUCT LISTING VIEW
    listProducts(parent, data, callback) {
        let html = '<p>Total money spent: <strong>$</strong><strong id="total-money-spent">0</strong></p>';
        for (const product of data) {
            html += `<div>
                        <input value="${product.id}" type="hidden">
                        <h4>  Product: ${product.name}</h4>
                        <b> $ ${product.price}</b>
                        <button class="btnBuy">Buy</button>
                    </div>`;
        }
        $(parent).html(html);
        $(".btnBuy").click(callback);
    }
    //METHOD TO CREATE THE PRODUCT SEARCH VIEW
    searchProduct(padre, callback) {
        $(padre).html(`
            <section>
                <h1>SEARCH PRODUCT BY ID</h1>
                <input type ="number">
                <button id="btnSearch">Search</button>
            </section>
        `);
        $("#btnSearch").click(callback);
    }
}

class ProductController {
    //CONTROLLER BUILDER ASSOCIATING A MODEL AND VIEW
    constructor(productModel, productView) {
        this.productModel = productModel;
        this.productView = productView;
    }
    //METHOD TO GENERATE CHECK THE VIEW, MODEL AND EVENT WHEN ADDING A PRODUCT
    add(app) {
        this.productView.addProduct(app, (event) => {
            let children = $(event.target).parent().children();
            this.productModel.addProduct({
                id: this.productModel.products.length + 1,
                name: children[1].value,
                price: children[2].value,
            });
            // DISPLAY CONFIRMATION TO USER
            $(app).append(`
                <div class="product-added">
                    <h4>Product added:</h4>
                    <p>id: ${this.productModel.products.length + 1}</p>
                    <p>name: ${children[1].value}</p>
                    <p>price: ${children[2].value}</p>
                </div>
            `);
            setTimeout(function() {
                $(".product-added").remove();
            }, 2000);
            // RESET THE FORM
            for (let child of children) {
                child.value = null;
            }
        });
    }
    //METHOD TO GENERATE CHECK THE VIEW, MODEL AND EVENT WHEN LISTING PRODUCTS
    list(app) {
        this.productView.listProducts(app,
            this.productModel.products,
            (event) => {
                let children = $(event.target).parent().children();
                console.log(children[0].value);
                $('#total-money-spent')[0].innerHTML = Number($('#total-money-spent')[0].innerHTML) + Number(children[0].value);
            });
    }
    //METHOD TO GENERATE CHECK THE VIEW, MODEL AND EVENT WHEN LOOKING FOR A PRODUCT
    search(app) {
        this.productView.searchProduct(app, (event) => {
            let children = $(event.target).parent().children();
            let id = parseInt(children[1].value);
            let found = this.productModel.searchProduct(id);
            console.log(found);
            $('.product-found').remove();
            $(app).append(`
                <div class="product-found">
                    <h4>Product found:</h4>
                    <p>id: ${found.id}</p>
                    <p>name: ${found.name}</p>
                    <p>price: ${found.price}</p>
                </div>
            `);
        });
    }
}
//COMPONENT TO BE USED WHEN THE REQUESTED PAGE IS NOT FOUND
const ErrorComponent = (parent) => {
    $(parent).html("<h2>Error 404</h2>");
}