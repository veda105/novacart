from fastapi import FastAPI, Depends, Header
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import engine, get_db
from models import Base, Product, Order
from schemas import (
    ProductCreate,
    UserCreate,
    UserLogin,
    OrderCreate
)
from auth import (
    create_access_token,
    verify_token
)

import crud

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():

    return {
        "message": "NovaCart Backend Running"
    }


@app.get("/products")
def get_products(
    db: Session = Depends(get_db)
):

    return crud.get_products(db)


@app.get("/products/{product_id}")
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):

    return crud.get_product_by_id(
        db,
        product_id
    )


@app.post("/products")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):



    new_product = Product(

        name=product.name,
        price=product.price,
        category=product.category,
        rating=product.rating,
        image=product.image,
        description=product.description
    )

    db.add(new_product)

    db.commit()

    db.refresh(new_product)

    return new_product


@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    return crud.update_product(
        db,
        product_id,
        product
    )


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    return crud.delete_product(
        db,
        product_id
    )


@app.post("/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    


    return crud.create_user(
        db,
        user.username,
        user.email,
        user.password
    )

@app.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = crud.login_user(
        db,
        user.email,
        user.password
    )

    if not existing_user:
        return {
            "message": "Invalid Credentials"
        }

    token = create_access_token(
    {
        "user_id": existing_user.id,
        "username": existing_user.username
    }
)
    return {
    "access_token": token,
    "token_type": "bearer",
    "username": existing_user.username
}

@app.get("/profile")
def profile(
    authorization: str = Header(None)
):

    if not authorization:

        return {
            "message": "Token Missing"
        }

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = verify_token(token)

    if not payload:

        return {
            "message": "Invalid Token"
        }

    return {
        "message": "Access Granted",
        "user": payload
    }


@app.post("/orders")
def create_order(
    order: OrderCreate,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):

    if not authorization:
        return {
            "message": "Token Missing"
        }

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = verify_token(token)

    if payload is None:
        return {
            "message": "Invalid Token"
        }

    new_order = Order(
        user_id=payload["user_id"],
        total_amount=order.total_amount
    )

    db.add(new_order)

    db.commit()

    db.refresh(new_order)

    return {
        "message": "Order Created",
        "order_id": new_order.id
    }


@app.get("/orders")
def get_orders(db: Session = Depends(get_db)):

    orders = db.query(Order).all()

    return orders