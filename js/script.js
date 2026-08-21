/* ==========================================================
   RentAttire - script.js
   Simple client-side logic (no frameworks).
   PHP + MySQL will handle real server-side logic later.
   ========================================================== */


/* ----------------------------------------------------------
   0) CART STATE
   The cart lives in the browser's localStorage so it stays
   available when the user moves between pages.
   ---------------------------------------------------------- */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


/* ----------------------------------------------------------
   1) MOBILE MENU TOGGLE
   ---------------------------------------------------------- */
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    if (navLinks) navLinks.classList.toggle("active");
}


/* ----------------------------------------------------------
   2) CART COUNT BADGE (top right of the header)
   ---------------------------------------------------------- */
function updateCartCount() {
    const countEl = document.getElementById("cartCount");
    if (!countEl) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
}


/* ----------------------------------------------------------
   3) ADD TO CART
   Called from product-details.html once the dates have been
   validated and the rental price has been calculated.
   ---------------------------------------------------------- */
function addToCart(product, qty, days, pickupDate, returnDate) {
    const subtotal = product.price * qty * days;

    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        days: days,
        pickupDate: pickupDate,
        returnDate: returnDate,
        subtotal: subtotal
    });

    saveCart();
    updateCartCount();
    alert(product.name + " has been added to your cart!");
    window.location.href = "cart.html";
}


/* ----------------------------------------------------------
   4) REMOVE FROM CART
   (cart.html also defines its own copy of this to re-render
   the page immediately - this version is kept for any other
   page that might need it.)
   ---------------------------------------------------------- */
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
}


/* ----------------------------------------------------------
   5) RENTAL PRICE CALCULATOR (product-details.html)
   Reads the Pickup Date and Return Date fields, works out the
   number of days, and shows: days x price/day = total.
   Returns { days } so handleAddToCart() can check it passed.
   ---------------------------------------------------------- */
function calculateRentalPrice() {
    const pickupInput = document.getElementById("pickupDate");
    const returnInput = document.getElementById("returnDate");
    const display = document.getElementById("totalPriceDisplay");
    if (!pickupInput || !returnInput || !display) return null;

    const pricePerDay = 2500; // Royal Red Saree demo price

    if (!pickupInput.value || !returnInput.value) {
        display.textContent = "Rs. 0";
        return null;
    }

    const pickup = new Date(pickupInput.value);
    const ret = new Date(returnInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Rule 1: pickup date cannot be in the past
    if (pickup < today) {
        alert("Pickup date cannot be in the past.");
        display.textContent = "Rs. 0";
        return null;
    }

    // Rule 2: return date must be after pickup date
    if (ret <= pickup) {
        alert("Return date must be after the pickup date.");
        display.textContent = "Rs. 0";
        return null;
    }

    const days = Math.round((ret - pickup) / (1000 * 60 * 60 * 24));
    const total = days * pricePerDay;

    display.textContent = "Rs. " + total.toLocaleString() + " (" + days + " day" + (days > 1 ? "s" : "") + ")";

    return { days: days, total: total };
}


/* ----------------------------------------------------------
   6) LOGIN FORM VALIDATION
   ---------------------------------------------------------- */
function validateLoginForm(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "") {
        alert("Please enter your email.");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (password === "") {
        alert("Please enter your password.");
        return false;
    }

    // Demo only - later this will submit to php/login.php
    alert("Login successful! (Demo)");
    window.location.href = "account.html";
    return false;
}


/* ----------------------------------------------------------
   7) REGISTRATION FORM VALIDATION
   ---------------------------------------------------------- */
function validateRegisterForm(event) {
    event.preventDefault();

    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const cpassword = document.getElementById("cpassword").value;
    const terms = document.getElementById("terms").checked;

    if (fname === "" || lname === "") {
        alert("Please enter your first and last name.");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    const phonePattern = /^[0-9]{9,10}$/;
    if (!phonePattern.test(phone)) {
        alert("Please enter a valid phone number (9-10 digits).");
        return false;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return false;
    }

    if (password !== cpassword) {
        alert("Passwords do not match.");
        return false;
    }

    if (!terms) {
        alert("You must agree to the Terms & Conditions.");
        return false;
    }

    // Demo only - later this will submit to php/register.php
    alert("Account created successfully! Please sign in.");
    window.location.href = "login.html";
    return false;
}


/* ----------------------------------------------------------
   8) CONTACT FORM VALIDATION
   ---------------------------------------------------------- */
function validateContactForm(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name === "" || subject === "" || message === "") {
        alert("Please fill in all fields.");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // Demo only - later this will submit to php/contact.php
    alert("Message sent! We'll get back to you soon.");
    document.getElementById("contactForm").reset();
    return false;
}


/* ----------------------------------------------------------
   9) ORDER TRACKING (tracking.html)
   Mock lookup that stands in for a future Ajax call to
   php/track-order.php. Highlights the current step on the
   timeline based on the order's status.
   ---------------------------------------------------------- */
const mockOrders = {
    "RA1001": { product: "Royal Red Saree", statusIndex: 5 }, // Completed
    "RA1002": { product: "Classic Black Suit", statusIndex: 2 }, // Ready for Pickup
    "RA1003": { product: "Pearl Bridal Dress", statusIndex: 1 }  // Preparing Attire
};

const trackingLabels = ["Booking Confirmed", "Preparing Attire", "Ready for Pickup", "Picked Up", "Returned", "Completed"];

function trackOrder(event) {
    event.preventDefault();

    const orderId = document.getElementById("orderId").value.trim().toUpperCase();
    const resultBox = document.getElementById("trackingResult");

    // Later this will be replaced with:
    // fetch("php/track-order.php?order_id=" + orderId).then(...)

    const order = mockOrders[orderId];

    if (!order) {
        resultBox.innerHTML = '<p class="text-muted">No order found with ID "' + orderId + '". Try RA1001, RA1002 or RA1003.</p>';
        return false;
    }

    let timelineHtml = '<h4 class="mb-3">' + orderId + ' &middot; ' + order.product + '</h4><div class="timeline">';
    trackingLabels.forEach(function (label, i) {
        let stateClass = "";
        if (i < order.statusIndex) stateClass = "done";
        if (i === order.statusIndex) stateClass = "current";
        timelineHtml += '<div class="timeline-step ' + stateClass + '">' + label + '</div>';
    });
    timelineHtml += '</div>';

    resultBox.innerHTML = timelineHtml;
    return false;
}


/* ----------------------------------------------------------
   10) VENDOR DATA & LOGIC (Marketplace Expansion)
   ---------------------------------------------------------- */
const shops = [
    {
        id: 1,
        name: "Colombo Silk House",
        city: "Colombo",
        category: "Sarees, Bridal Wear",
        rating: 4.7,
        logo: "images/logo.svg"
    },
    {
        id: 2,
        name: "Kandy Formal Wear",
        city: "Kandy",
        category: "Suits, Formal",
        rating: 4.5,
        logo: "images/logo.svg"
    }
];

const mockProducts = [
    { id: 1, name: "Royal Red Saree", category: "Sarees", price: 2500, availability: "Available", image: "images/saree_model.png", shopId: 1 },
    { id: 2, name: "Classic Black Suit", category: "Suits", price: 3000, availability: "Available", image: "images/suit_model.png", shopId: 2 },
    { id: 3, name: "Pearl Bridal Dress", category: "Bridal Wear", price: 5000, availability: "Limited", image: "images/bridal_model.png", shopId: 1 },
    { id: 4, name: "Emerald Evening Dress", category: "Dresses", price: 3500, availability: "Available", image: "images/evening_dress.png", shopId: 1 },
    { id: 5, name: "Traditional Gold Saree", category: "Sarees", price: 2800, availability: "Available", image: "images/saree_model.png", shopId: 1 },
    { id: 6, name: "Midnight Blue Suit", category: "Suits", price: 3200, availability: "Unavailable", image: "images/suit_model.png", shopId: 2 }
];

function validateVendorRegisterForm(event) {
    event.preventDefault();
    const shopName = document.getElementById("shopName")?.value.trim();
    const ownerName = document.getElementById("ownerName")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;
    
    if (!shopName || !ownerName || !email || !password) {
        alert("Please fill in all required fields.");
        return false;
    }
    alert("Vendor Account created successfully! Please sign in.");
    window.location.href = "vendor-login.html";
    return false;
}

function validateVendorLoginForm(event) {
    event.preventDefault();
    alert("Vendor Login successful! (Demo)");
    window.location.href = "vendor-dashboard.html";
    return false;
}

function validateAddProductForm(event) {
    event.preventDefault();
    const name = document.getElementById("productName")?.value.trim();
    const price = document.getElementById("price")?.value.trim();
    
    if (!name || !price) {
        alert("Please fill in at least the product name and price.");
        return false;
    }
    alert("Product added successfully! (Demo)");
    window.location.href = "vendor-products.html";
    return false;
}

function renderVendorProducts() {
    const container = document.getElementById("vendorProductsGrid");
    if (!container) return;
    
    let html = '';
    mockProducts.filter(p => p.shopId === 1).forEach(p => {
        let badgeClass = p.availability === 'Available' ? 'badge-available' : (p.availability === 'Limited' ? 'badge-limited' : 'badge-unavailable');
        html += `
        <div class="card">
            <div class="card-img"><img src="${p.image}" alt="${p.name}"></div>
            <div class="card-body">
                <span class="badge ${badgeClass} mb-2">${p.availability}</span>
                <h3 class="card-title">${p.name}</h3>
                <div class="price">Rs. ${p.price} / day</div>
                <div class="d-flex" style="gap: 10px;">
                    <button class="btn btn-outline" style="flex:1; padding: 8px;">Edit</button>
                    <button class="btn btn-outline" style="flex:1; padding: 8px; border-color:var(--error); color:var(--error);">Remove</button>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function renderVendorOrders() {
    const tbody = document.getElementById("vendorOrdersBody");
    if (!tbody) return;
    
    const mockVendorOrders = [
        { id: "RA1001", product: "Royal Red Saree", customer: "John Doe", dates: "Oct 12 - Oct 15", status: "Completed" },
        { id: "RA1003", product: "Pearl Bridal Dress", customer: "Jane Smith", dates: "Nov 01 - Nov 05", status: "Preparing Attire" }
    ];
    
    let html = '';
    mockVendorOrders.forEach(o => {
        let badgeClass = o.status === 'Completed' ? 'badge-available' : 'badge-limited';
        html += `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${o.id}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${o.product}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${o.customer}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${o.dates}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;"><span class="badge ${badgeClass}">${o.status}</span></td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                <select class="form-control" style="padding:4px; font-size:12px; display:inline-block; width:auto;" onchange="updateOrderStatus('${o.id}', this.value)">
                    <option value="">Update...</option>
                    <option value="Preparing Attire">Preparing Attire</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Picked Up">Picked Up</option>
                    <option value="Returned">Returned</option>
                    <option value="Completed">Completed</option>
                </select>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function updateOrderStatus(orderId, newStatus) {
    if (!newStatus) return;
    alert("Order " + orderId + " status updated to: " + newStatus + " (Demo)");
}

function renderShopList() {
    const container = document.getElementById("shopsGrid");
    if (!container) return;
    
    let html = '';
    shops.forEach(s => {
        const productCount = mockProducts.filter(p => p.shopId === s.id).length;
        html += `
        <div class="card">
            <div class="card-body text-center">
                <img src="${s.logo}" width="60" style="margin: 0 auto 15px;">
                <h3 class="card-title">${s.name}</h3>
                <p class="text-muted mb-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-top:-2px;">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg> ${s.city}
                </p>
                <p style="font-size:13px;" class="mb-3">${s.category}</p>
                <div class="d-flex justify-between align-center mb-3 text-muted" style="font-size:12px;">
                    <span>★ ${s.rating}</span>
                    <span>${productCount} items</span>
                </div>
                <a href="shop-profile.html?id=${s.id}" class="btn btn-outline" style="width:100%">Visit Shop</a>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function renderShopProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const shopId = parseInt(urlParams.get('id')) || 1;
    const shop = shops.find(s => s.id === shopId);
    
    if (!shop) return;
    
    const titleEl = document.getElementById("shopProfileName");
    const locationEl = document.getElementById("shopProfileLocation");
    const container = document.getElementById("shopProductsGrid");
    
    if (titleEl) titleEl.textContent = shop.name;
    if (locationEl) {
        locationEl.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-top:-2px;">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg> ${shop.city} &middot; ★ ${shop.rating}`;
    }
    
    if (container) {
        let html = '';
        mockProducts.filter(p => p.shopId === shopId).forEach(p => {
            let badgeClass = p.availability === 'Available' ? 'badge-available' : (p.availability === 'Limited' ? 'badge-limited' : 'badge-unavailable');
            html += `
            <div class="card">
                <div class="card-img"><img src="${p.image}" alt="${p.name}"></div>
                <div class="card-body text-center">
                    <span class="badge ${badgeClass} mb-2">${p.availability}</span>
                    <p style="font-size:12px; color:var(--muted)">${p.category}</p>
                    <h3 class="card-title">${p.name}</h3>
                    <div class="price">Rs. ${p.price} / day</div>
                    <a href="product-details.html?id=${p.id}" class="btn btn-outline" style="width:100%">View Details</a>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    }
}


/* ----------------------------------------------------------
   11) RUN ON PAGE LOAD
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    if (hamburger) hamburger.addEventListener("click", toggleMenu);

    updateCartCount();

    // Vendor & Shop initialization
    renderVendorProducts();
    renderVendorOrders();
    renderShopList();
    renderShopProfile();
});
