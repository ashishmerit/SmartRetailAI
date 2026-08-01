from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.customer.schema import CustomerCreate, CustomerResponse
from app.customer.service import (
    create_customer,
    get_all_customers
)

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post("/", response_model=CustomerResponse)
def create_customer_route(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):
    return create_customer(db, customer)


@router.get("/", response_model=list[CustomerResponse])
def get_customers_route(
    db: Session = Depends(get_db)
):
    return get_all_customers(db)