from app.visit.model import Visit
from app.review.model import Review

from app.visit.schema import VisitResponse
from app.review.schema import ReviewResponse

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.customer.schema import (
    CustomerCreate,
    CustomerResponse,
)

from app.customer.service import (
    create_customer,
    get_all_customers,
)

from app.customer.model import Customer

from app.auth.dependencies import (
    get_current_user,
    require_admin,
    require_customer,
)

from app.auth.model import User


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


# --------------------------------------------------
# Admin - Create Customer
# --------------------------------------------------

@router.post(
    "/",
    response_model=CustomerResponse,
)
def create_customer_route(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return create_customer(
        db,
        customer,
    )


# --------------------------------------------------
# Admin - Get All Customers
# --------------------------------------------------

@router.get(
    "/",
    response_model=list[CustomerResponse],
)
def get_customers_route(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return get_all_customers(db)


# --------------------------------------------------
# Customer - Get Own Profile
# --------------------------------------------------

@router.get(
    "/me",
    response_model=CustomerResponse,
)
def get_my_customer_profile(
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    if current_user.customer_id is None:
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found.",
        )

    customer = (
        db.query(Customer)
        .filter(
            Customer.id == current_user.customer_id
        )
        .first()
    )

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found.",
        )

    return customer

# --------------------------------------------------
# Customer - Own Visit History
# --------------------------------------------------

@router.get(
    "/me/visits",
    response_model=list[VisitResponse],
)
def get_my_visits(
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    if current_user.customer_id is None:
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found.",
        )

    return (
        db.query(Visit)
        .filter(
            Visit.customer_id == current_user.customer_id
        )
        .order_by(Visit.visit_time.desc())
        .all()
    )


# --------------------------------------------------
# Customer - Own Review History
# --------------------------------------------------

@router.get(
    "/me/reviews",
    response_model=list[ReviewResponse],
)
def get_my_reviews(
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    if current_user.customer_id is None:
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found.",
        )

    return (
        db.query(Review)
        .filter(
            Review.customer_id == current_user.customer_id
        )
        .order_by(Review.id.desc())
        .all()
    )