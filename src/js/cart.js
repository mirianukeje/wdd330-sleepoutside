import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  updateCartFooter(cartItems);
}

function cartItemTemplate(item) {
  const img = item?.Images?.PrimaryMedium || "";
  const name = item?.Name || item?.NameWithoutBrand || "Product";
  const color = item?.Colors?.[0]?.ColorName || "";
  const price = item?.FinalPrice ?? item?.ListPrice ?? 0;

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${img}" alt="${name}">
    </a>
    <a href="#"><h2 class="card__name">${name}</h2></a>
    <p class="cart-card__color">${color}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${price}</p>
  </li>`;
}

function updateCartFooter(items) {
  const footer = document.querySelector(".list-footer");
  const totalEl = document.querySelector(".list-total");

  if (!footer || !totalEl) return;

  if (items.length === 0) {
    footer.classList.add("hide");
    totalEl.textContent = "Total: ";
    return;
  }

  const total = items.reduce((sum, item) => {
    const price = item?.FinalPrice ?? item?.ListPrice ?? 0;
    return sum + Number(price);
  }, 0);

  // Format as $1,234.56 (US Dollars)
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total);

  footer.classList.remove("hide");
  totalEl.textContent = `Total: ${formatted}`;
}

renderCartContents();

// import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

// loadHeaderFooter();

// function renderCartContents() {
//   const cartItems = getLocalStorage("so-cart");
//   const htmlItems = cartItems.map((item) => cartItemTemplate(item));
//   document.querySelector(".product-list").innerHTML = htmlItems.join("");
// }

// function cartItemTemplate(item) {
//   const newItem = `<li class="cart-card divider">
//   <a href="#" class="cart-card__image">
//     <img
//       src="${item.Images.PrimaryMedium}"
//       alt="${item.Name}"
//     />
//   </a>
//   <a href="#">
//     <h2 class="card__name">${item.Name}</h2>
//   </a>
//   <p class="cart-card__color">${item.Colors[0].ColorName}</p>
//   <p class="cart-card__quantity">qty: 1</p>
//   <p class="cart-card__price">$${item.FinalPrice}</p>
// </li>`;

//   return newItem;
// }

// renderCartContents();
