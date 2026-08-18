from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.auth.dependencies import require_customer
from app.auth.model import User
from fastapi import APIRouter, Depends, HTTPException

from app.review.schema import (
    ReviewCreate,
    ReviewResponse
)

from app.review.service import (
    create_review,
    get_all_reviews
)

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


@router.post(
    "/",
    response_model=ReviewResponse,
)
def create_review_route(
    review: ReviewCreate,
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    if current_user.customer_id is None:
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found",
        )

    return create_review(
        db,
        review,
        current_user.customer_id,
    )