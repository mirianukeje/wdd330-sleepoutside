import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

// Load the header and footer templates into the page
loadHeaderFooter();

// Get the category from the URL parameters
const category = getParam("category");

// Create a new data source for tents
const dataSource = new ProductData();

// Get the product list element from the DOM
const element = document.querySelector(".product-list");

// Create a new ProductList instance
const productList = new ProductList(category, dataSource, element);

// Initialize the product list (fetch data and render)
productList.init();
