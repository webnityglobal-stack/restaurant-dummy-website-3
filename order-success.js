document.addEventListener("DOMContentLoaded", () => {

    const ORDERS_KEY = "foodora_orders";

    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const order = orders.length ? orders[orders.length - 1] : null;

    const formatPrice = value =>
        "₹" + Number(value || 0).toFixed(2);

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    if (!order) {
        document.querySelector(".success-banner h1").textContent =
            "No Order Found";

        document.querySelector(".success-banner > p").textContent =
            "Please place an order before visiting this page.";

        return;
    }

    document.getElementById("successOrderId").textContent = order.orderId;

    document.getElementById("orderDate").textContent =
        new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    // Demo delivery estimate: 3-5 days
    const deliveryDate = new Date(order.createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + 4);

    document.getElementById("deliveryDate").textContent =
        deliveryDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    document.getElementById("placedTime").textContent =
        new Date(order.createdAt).toLocaleString("en-IN");

    document.getElementById("paymentMethod").textContent =
        order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod;

    // Order Products
    document.getElementById("successProducts").innerHTML =
        (order.products || []).map(product => `
            <div class="success-product">

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.title)}"
                    onerror="this.src='https://placehold.co/100x100?text=Foodora'"
                >

                <div class="success-product-info">
                    <h4>${escapeHTML(product.title)}</h4>
                    <p>Quantity: ${Number(product.quantity || 1)}</p>
                </div>

                <div class="success-product-price">
                    ${formatPrice(Number(product.price) * Number(product.quantity || 1))}
                </div>

            </div>
        `).join("");

    // Price Details
    document.getElementById("successSubtotal").textContent =
        formatPrice(order.subtotal);

    document.getElementById("successShipping").textContent =
        order.shipping === 0 ? "FREE" : formatPrice(order.shipping);

    document.getElementById("successDiscount").textContent =
        "- " + formatPrice(order.discount);

    document.getElementById("successTotal").textContent =
        formatPrice(order.total);

    // Customer Address
    const customer = order.customer || {};

    document.getElementById("customerName").textContent =
        customer.name || "";

    document.getElementById("customerAddress").textContent = [
        customer.address,
        customer.landmark,
        customer.city,
        customer.state,
        customer.pincode,
        customer.country
    ].filter(Boolean).join(", ");

    document.getElementById("customerPhone").textContent =
        customer.phone ? "Mobile: " + customer.phone : "";

});