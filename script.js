let cart = [];

function addToCart(productName, price) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity += 1; // Increase quantity if product already exists
    } else {
        cart.push({ name: productName, price: price, quantity: 1 }); // Add new product to cart
    }
    updateCart();
    updateButtonDisplay(productName, price);
}

function updateButtonDisplay(productName, price) {
    const button = document.querySelector(`button[data-product="${productName}"]`);
    const product = cart.find(item => item.name === productName);
    const quantity = product ? product.quantity : 0;

    // Set the button content
    button.innerHTML = `
        <div class="quantity-display">
            <button class="decrement" onclick="decrement('${productName}')">
                <img src="./assets/images/icon-decrement-quantity.svg" alt="Decrement">
            </button>
            <span class="quantity-number">${quantity}</span>
            <button class="increment" onclick="increment('${productName}', ${price})">
                <img src="./assets/images/icon-increment-quantity.svg" alt="Increment">
            </button>
        </div>
    `;

    const quantityDisplay = button.querySelector('.quantity-display');

    // Show the quantity controls when hovering
    button.addEventListener('mouseenter', () => {
        quantityDisplay.style.display = 'flex';
        button.style.color = 'hsl(14, 55%, 42%)'; // Change text color on hover
        button.style.borderColor = 'hsl(14, 55%, 42%)'; // Change border color on hover
    });

    // Revert back to 'Add to Cart' if no items exist on mouse leave
    button.addEventListener('mouseleave', () => {
        if (quantity === 0) {
            button.innerHTML = `<span>Add to Cart</span>`;
        }
    });
}

function increment(productName, price) {
    addToCart(productName, price); // Increment product quantity
}

function decrement(productName) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity -= 1; // Decrease quantity
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.name !== productName); // Remove item from cart if quantity is zero
        }
    }
    updateCart();
    updateButtonDisplay(productName, product ? product.price : 0); // Update button with correct quantity
}

function updateCart() {
    const cartItemsElement = document.getElementById("cart-items");
    const cartCountElement = document.getElementById("cart-count");

    cartItemsElement.innerHTML = "";
    let total = 0;

    cart.forEach((cartItem, index) => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.textContent = `${cartItem.quantity} x ${cartItem.name} - $${(cartItem.price * cartItem.quantity).toFixed(2)}`;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-item";
        removeButton.innerHTML = `<img src="./assets/images/icon-remove-item.svg" alt="Remove">`;
        
        removeButton.onclick = () => {
            cart.splice(index, 1); // Remove item from cart
            updateCart();
            updateButtonDisplay(cartItem.name, cartItem.price); // Update button display after removal
        };

        itemElement.appendChild(removeButton);
        cartItemsElement.appendChild(itemElement);

        total += cartItem.price * cartItem.quantity;
    });

    cartCountElement.textContent = cart.length;

    if (cart.length === 0) {
        cartItemsElement.innerHTML = "<p>Your added items will appear here</p>";
    }

    const totalPriceElement = document.getElementById("total-price");
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

function confirmOrder() {
    const modal = document.getElementById('order-confirmation-modal');
    const orderSummaryElement = document.getElementById('order-summary');
    orderSummaryElement.innerHTML = '';

    cart.forEach(item => {
        const summaryItem = document.createElement('p');
        summaryItem.textContent = `${item.name} - $${item.price} (x${item.quantity})`;
        orderSummaryElement.appendChild(summaryItem);
    });

    modal.style.display = 'flex';
    cart = [];
    updateCart();
}

function closeModal() {
    const modal = document.getElementById('order-confirmation-modal');
    modal.style.display = 'none';
}