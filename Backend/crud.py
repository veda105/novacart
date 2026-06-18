from sqlalchemy.orm import Session
from models import Product


def get_products(db: Session):

    return db.query(Product).all()


def get_product_by_id(
    db: Session,
    product_id: int
):

    return db.query(Product).filter(
        Product.id == product_id
    ).first()


def update_product(
    db: Session,
    product_id: int,
    product_data
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return None

    product.name = product_data.name
    product.price = product_data.price
    product.category = product_data.category
    product.rating = product_data.rating
    product.image = product_data.image
    product.description = product_data.description

    db.commit()

    db.refresh(product)

    return product


def delete_product(
    db: Session,
    product_id: int
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return None

    db.delete(product)

    db.commit()

    return {
        "message": "Product deleted successfully"
    }


from models import User


def create_user(
    db: Session,
    username: str,
    email: str,
    password: str,
    role: str = "user"
):

    user = User(
    username=username,
    email=email,
    password=password,
    role=role
)

    db.add(user)

    db.commit()

    db.refresh(user)

    return user 

def get_user_by_email(
    db: Session,
    email: str
):

    return db.query(User).filter(
        User.email == email
    ).first()


from models import User

def login_user(
    db: Session,
    email: str,
    password: str
):

    return db.query(User).filter(
        User.email == email,
        User.password == password
    ).first()

from models import Order

def get_orders_by_user(
    db: Session,
    user_id: int
):

    return db.query(Order).filter(
        Order.user_id == user_id
    ).all()