import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./alert.js";

// Create a new data source for tents

const dataSource = new ProductData("tents");

// Get the product list element from the DOM

const element = document.querySelector(".product-list");

// Create a new ProductList instance

const productList = new ProductList("Tents", dataSource, element);

// Initialize the product list (fetch data and render)

productList.init();

// Create a new Alert instance and point it to the alerts.json file
const alert = new Alert("./json/alerts.json");

// Initialize the alert system (fetch alerts and render them if available)
alert.init();
