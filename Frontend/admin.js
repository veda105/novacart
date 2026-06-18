let products = [];

const API_URL =
"https://novacart-production-fb18.up.railway.app";

async function loadProducts() {

    try {

        const response =
        await fetch(
            `${API_URL}/products`
        );

        products =
        await response.json();

        renderProducts();

        loadStats();

    }
    catch(error){

        console.log(error);

    }

}

function renderProducts(){

    const table =
    document.getElementById(
        "productTable"
    );

    table.innerHTML = "";

    products.forEach(product => {

        table.innerHTML += `

        <tr>

            <td>${product.id}</td>

            <td>${product.name}</td>

            <td>₹${product.price}</td>

            <td>${product.category}</td>

            <td>

                <button
                class="delete-btn"
                onclick="deleteProduct(${product.id})">

                Delete

                </button>

            </td>

        </tr>

        `;

    });

}

async function addProduct(){

    const product = {

        name:
        document.getElementById("name").value,

        price:
        Number(
            document.getElementById("price").value
        ),

        category:
        document.getElementById("category").value,

        rating:
        Number(
            document.getElementById("rating").value
        ),

        image:
        document.getElementById("image").value,

        description:
        document.getElementById("description").value

    };

    const response =
    await fetch(
        `${API_URL}/products`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body:
            JSON.stringify(product)
        }
    );

    if(response.ok){

        alert(
            "Product Added Successfully"
        );

        loadProducts();

        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("category").value = "";
        document.getElementById("rating").value = "";
        document.getElementById("image").value = "";
        document.getElementById("description").value = "";

    }

}

async function deleteProduct(id){

    const confirmDelete =
    confirm(
        "Delete this product?"
    );

    if(!confirmDelete)
    return;

    await fetch(
        `${API_URL}/products/${id}`,
        {
            method: "DELETE"
        }
    );

    loadProducts();

}

function loadStats(){

    document.getElementById(
        "totalProducts"
    ).innerText =
    products.length;

}

loadProducts();