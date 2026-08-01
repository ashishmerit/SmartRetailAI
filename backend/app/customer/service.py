from sqlalchemy.orm import Session

from app.customer.model import Customer
from app.customer.schema import CustomerCreate

from sqlalchemy.exc import IntegrityError

from app.core.exceptions import CustomerAlreadyExistsException

from app.core.logger import logger


def create_customer(db: Session, customer: CustomerCreate):
    new_customer = Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone,
    )

    try:
        db.add(new_customer)
        db.commit()
        db.refresh(new_customer)
        logger.info(f"Customer created | ID={new_customer.id} | Email={new_customer.email}")
        return new_customer

    except IntegrityError:
        db.rollback()
        logger.warning(f"Duplicate customer creation attempted | Email={customer.email}")
        raise CustomerAlreadyExistsException()


def get_all_customers(db: Session):
    customers = db.query(Customer).all()

    logger.info(f"Fetched {len(customers)} customers")

    return customers