import {
  getLocalStorage,
  loadHeaderFooter,
  setLocalStorage,
} from "./utils.mjs";

loadHeaderFooter();

/** Read raw cart (array of product objects) */
function readCartRaw() {
  return getLocalStorage("so-cart") || [];
}

/** Write raw cart (array of product objects) */
function writeCartRaw(arr) {
  setLocalStorage("so-cart", arr);
}

/** Compress raw cart into line items: { id, product, qty } */
function compressCart(raw) {
  const map = new Map();
  for (const prod of raw) {
    const id = prod?.Id ?? prod?.id; // tolerate either Id or id
    if (!id) continue;
    const current = map.get(id);
    if (current) current.qty += 1;
    else map.set(id, { id, product: prod, qty: 1 });
  }
  return Array.from(map.values());
}

/** Expand line items back to raw cart */
function expandCart(lines) {
  const raw = [];
  for (const line of lines) {
    for (let i = 0; i < line.qty; i++) raw.push(line.product);
  }
  return raw;
}

/** Render the entire cart list + footer total */
function renderCart() {
  const raw = readCartRaw();
  const lines = compressCart(raw);

  // List
  const listEl = document.querySelector(".product-list");
  listEl.innerHTML = lines.map(cartItemTemplate).join("");

  // Footer (total / show-hide)
  updateCartFooter(lines);
}

/** One cart line template with editable quantity */
function cartItemTemplate(line) {
  const item = line.product;
  const qty = line.qty;

  const img =
    item?.Images?.PrimaryMedium ||
    item?.Images?.PrimarySmall ||
    item?.Images?.PrimaryLarge ||
    "";
  const name = item?.Name || item?.NameWithoutBrand || "Product";
  const color = item?.Colors?.[0]?.ColorName || "";
  const price = item?.FinalPrice ?? item?.ListPrice ?? 0;

  // Display price as a line total for clarity
  const lineTotal = price * qty;

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(n) || 0);

  return `<li class="cart-card divider" data-id="${item?.Id ?? item?.id}">
    <a href="#" class="cart-card__image">
      <img src="${img}" alt="${name}">
    </a>
    <a href="#"><h2 class="card__name">${name}</h2></a>
    <p class="cart-card__color">${color}</p>

    <p class="cart-card__quantity">
      qty:
      <input class="qty-input" type="number" min="1" step="1" value="${qty}" aria-label="Quantity for ${name}">
    </p>

    <p class="cart-card__price">${fmt(lineTotal)}</p>
  </li>`;
}

/** Show/hide footer and compute total = sum(price * qty) */
function updateCartFooter(lines) {
  const footer = document.querySelector(".list-footer");
  const totalEl = document.querySelector(".list-total");
  if (!footer || !totalEl) return;

  if (!lines.length) {
    footer.classList.add("hide");
    totalEl.textContent = "Total: ";
    return;
  }

  const total = lines.reduce((sum, { product, qty }) => {
    const price = product?.FinalPrice ?? product?.ListPrice ?? 0;
    return sum + Number(price) * Number(qty || 1);
  }, 0);

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total);

  footer.classList.remove("hide");
  totalEl.textContent = `Total: ${formatted}`;
}

/** Handle quantity changes via event delegation */
function attachQtyHandlers() {
  const listEl = document.querySelector(".product-list");
  listEl.addEventListener("change", (evt) => {
    const input = evt.target;
    if (!input.classList.contains("qty-input")) return;

    const li = input.closest(".cart-card");
    const id = li?.dataset?.id;
    let newQty = parseInt(input.value, 10);

    if (!id || isNaN(newQty) || newQty < 1) {
      // normalize invalid values back to 1
      newQty = 1;
      input.value = "1";
    }

    // Read current cart, convert to lines, update the line's qty, write back
    const lines = compressCart(readCartRaw());
    const target = lines.find((l) => String(l.id) === String(id));
    if (!target) return;

    target.qty = newQty;
    writeCartRaw(expandCart(lines));
    renderCart(); // re-render to refresh totals and line totals
  });
}

/** Init */
renderCart();
attachQtyHandlers();
