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
   10) RUN ON PAGE LOAD
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    if (hamburger) hamburger.addEventListener("click", toggleMenu);

    updateCartCount();
});
