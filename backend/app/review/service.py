from sqlalchemy.orm import Session

from app.review.model import Review
from app.review.schema import ReviewCreate


def create_review(db: Session, review: ReviewCreate):
    new_review = Review(
        customer_id=review.customer_id,
        review=review.review,
        rating=review.rating,
        sentiment=None
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review


def get_all_reviews(db: Session):
    return db.query(Review).all()