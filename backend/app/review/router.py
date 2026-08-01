from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

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


@router.post("/", response_model=ReviewResponse)
def create_review_route(
    review: ReviewCreate,
    db: Session = Depends(get_db)
):
    return create_review(db, review)


@router.get("/", response_model=list[ReviewResponse])
def get_reviews_route(
    db: Session = Depends(get_db)
):
    return get_all_reviews(db)