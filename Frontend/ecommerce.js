const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let products = [];

async function loadProducts() {

    try {

        const response =
        await fetch(
            "https://novacart-production-fb18.up.railway.app/products"
        );

        products =
        await response.json();

        console.log(products);

        renderProducts(products);

    }
    catch(error){

        console.log(
            "Error loading products",
            error
        );

    }

}

loadProducts();

const productContainer =
document.getElementById("productContainer");

const searchInput =
document.getElementById("searchInput");

const suggestions =
document.getElementById("suggestions");

function renderProducts(productList){

    if(!productContainer) return;

    productContainer.innerHTML = "";

    productList.forEach(product=>{

        productContainer.innerHTML += `
        <div class="product-card">

        <img src="${product.image}">

        <div class="product-info">

        <h3>${product.name}</h3>

        <p>
        ⭐⭐⭐⭐⭐ ${product.rating}
        </p>

        <p class="price">
        ₹${product.price.toLocaleString()}
        </p>

        <p>
        ${product.category}
        </p>

        <div class="product-buttons">

        <button
        class="view-btn"
        onclick="viewProduct(${product.id})">

        View

        </button>

        <button
        class="cart-add-btn"
        onclick="addToCart(${product.id})">

        Add

        </button>

        </div>

        </div>

        </div>
        `;

    });

}

renderProducts(products);

function addToCart(id){

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const product =
    products.find(
        p => p.id === id
    );

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

}

function updateCartCount(){

    const cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const count =
    document.getElementById(
        "cartCount"
    );

    if(count){

        count.innerText =
        cart.length;

    }

}

function viewProduct(id){

    const product =
    products.find(
        p => p.id === id
    );

    localStorage.setItem(
        "selectedProduct",
        JSON.stringify(product)
    );

    window.location.href =
    "product.html";

}

function getWishlist(){

    return JSON.parse(
        localStorage.getItem(
            "wishlist"
        )
    ) || [];

}

function saveWishlist(wishlist){

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

}

function toggleWishlist(id){

    let wishlist =
    getWishlist();

    const product =
    products.find(
        p => p.id === id
    );

    const exists =
    wishlist.find(
        item => item.id === id
    );

    if(exists){

        wishlist =
        wishlist.filter(
            item => item.id !== id
        );

    }
    else{

        wishlist.push(product);

    }

    saveWishlist(wishlist);

    renderProducts(products);

}

if(searchInput){

    searchInput.addEventListener(
        "input",
        function(){

            const value =
            this.value
            .toLowerCase();

            const filtered =
            products.filter(
                product =>
                product.name
                .toLowerCase()
                .includes(value)
            );

            renderProducts(filtered);

            if(!suggestions)
            return;

            suggestions.innerHTML = "";

            if(value === ""){

                suggestions.style.display =
                "none";

                return;

            }

            filtered
            .slice(0,5)
            .forEach(product=>{

                suggestions.innerHTML +=
                `
                <div
                class="suggestion-item"
                onclick="viewProduct(${product.id})">

                ${product.name}

                </div>
                `;

            });

            suggestions.style.display =
            "block";

        }
    );

}

document
.querySelectorAll(
    ".category-card"
)
.forEach(card=>{

    card.addEventListener(
        "click",
        function(){

            const category =
            this.dataset.category;

            const filtered =
            products.filter(
                product =>
                product.category ===
                category
            );

            renderProducts(filtered);

        }
    );

});

updateCartCount();

document.addEventListener(
    "click",
    function(e){

        if(
            suggestions &&
            searchInput &&
            !searchInput.contains(
                e.target
            ) &&
            !suggestions.contains(
                e.target
            )
        ){

            suggestions.style.display =
            "none";

        }

    }
);

const loggedUser =
localStorage.getItem(
    "username"
);

const authSection =
document.getElementById(
    "authSection"
);

if(loggedUser && authSection){

    let adminButton = "";

    const role =
localStorage.getItem("role");

if(role === "admin")

    authSection.innerHTML = `

    <span class="welcome-user">
    Welcome ${loggedUser}
    </span>

    <button onclick="getProfile()">
    Profile
    </button>

    <button
    onclick="window.location.href='orders.html'">
    Orders
    </button>

    ${adminButton}

    <button
    class="logout-btn"
    onclick="logout()">
    Logout
    </button>

    `;
}
function logout(){

    localStorage.removeItem("token");

    localStorage.removeItem("username");

    window.location.href = "login.html";

}

async function getProfile(){

    const token =
    localStorage.getItem("token");

    const response =
    await fetch(
        "https://novacart-production-fb18.up.railway.app/profile",
        {
            method: "GET",
            headers: {
                "Authorization":
                `Bearer ${token}`
            }
        }
    );

    const data =
    await response.json();

    console.log(data);

    alert(
        "Username: " +
        data.user.username
    );

}