from sqlalchemy.orm import Session

from app.customer.model import Customer
from app.customer.schema import CustomerCreate


def create_customer(db: Session, customer: CustomerCreate):
    new_customer = Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


def get_all_customers(db: Session):
    return db.query(Customer).all()