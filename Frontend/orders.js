console.log("orders.js loaded");


const token =
localStorage.getItem("token");

async function loadOrders(){

    const response =
    await fetch(
        "https://novacart-production-fb18.up.railway.app/orders",
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const orders =
    await response.json();
console.log("ORDERS RESPONSE:", orders);

if(!Array.isArray(orders)){
    alert(JSON.stringify(orders));
    return;
}

    const container =
    document.getElementById(
        "ordersContainer"
    );

    container.innerHTML = "";

    orders.forEach(order=>{

        container.innerHTML += `

        <div class="product-card">

            <div class="product-info">

                <h3>
                Order #${order.id}
                </h3>

                <p>
                Total Amount
                </p>

                <p class="price">
                ₹${order.total_amount}
                </p>

            </div>

        </div>

        `;

    });

}

loadOrders();