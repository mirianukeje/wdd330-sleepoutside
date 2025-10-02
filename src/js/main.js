import Alert from "./alert.js";
import { loadHeaderFooter } from "./utils.mjs";

// Load the header and footer templates into the page
loadHeaderFooter();

// Create a new Alert instance and point it to the alerts.json file
const alert = new Alert("./json/alerts.json");

// Initialize the alert system (fetch alerts and render them if available)
alert.init();
