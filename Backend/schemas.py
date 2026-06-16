from pydantic import BaseModel

class ProductCreate(BaseModel):

    name: str
    price: float
    category: str
    rating: float
    image: str
    description: str

class UserCreate(BaseModel):

    username: str

    email: str

    password: str


class UserLogin(BaseModel):

    email: str

    password: str

class OrderCreate(BaseModel):

    total_amount: float