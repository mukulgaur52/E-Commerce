const apiEndpoint = "https://fakestoreapi.com/products";
const productsContainer = document.getElementById("products");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const checkoutButton = document.getElementById("checkout-btn");

const usdToBnbConversionRate = 300; // Example: 1 BNB = $300 (adjust as needed)

let cart = [];

// Fetch products from the API
fetch(apiEndpoint)
  .then(response => response.json())
  .then(products => {
    products.forEach(product => {
      const productCard = document.createElement("div");
      productCard.classList.add("product");

      // Convert price to BNB
      const priceInBnb = (product.price / usdToBnbConversionRate).toFixed(4);

      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>${priceInBnb} BNB</p>
        <p class="price-usd">$${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">Add to Cart</button>
      `;

      productsContainer.appendChild(productCard);
    });
  });

// Add product to cart
function addToCart(id, title, price, image) {
  const existingProduct = cart.find(item => item.id === id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }
  updateCart();
}

// Update cart UI
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let totalPriceInUsd = 0;

  cart.forEach(item => {
    totalPriceInUsd += item.price * item.quantity;

    // Convert price to BNB
    const priceInBnb = (item.price / usdToBnbConversionRate).toFixed(4);

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-details">
        <p>${item.title}</p>
        <p>${priceInBnb} BNB</p>
        <p class="price-usd">$${item.price.toFixed(2)} x ${item.quantity}</p>
      </div>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  // Update total price in BNB
  const totalPriceInBnb = (totalPriceInUsd / usdToBnbConversionRate).toFixed(4);
  totalPriceElement.innerHTML = `${totalPriceInBnb} BNB<br><span class="price-usd">$${totalPriceInUsd.toFixed(2)}</span>`;
  checkoutButton.disabled = cart.length === 0;
}

// Remove product from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}
