from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.review.model import Review
from app.review.schema import ReviewCreate

from app.customer.model import Customer
from app.visit.model import Visit

from app.ml.sentiment_analysis import sentiment_service

from app.core.exceptions import (
    CustomerNotFoundException,
    CustomerHasNoVisitException,
)



def create_review(db: Session, review: ReviewCreate):
    
    predicted_sentiment = sentiment_service.predict(review.review)

    customer = db.query(Customer).filter(Customer.id == review.customer_id).first()

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    visit = db.query(Visit).filter(Visit.customer_id == review.customer_id).first()
    if visit is None:
        raise HTTPException(
            status_code=400,
            detail="Customer has not visited the store"
        )

    new_review = Review(
        customer_id=review.customer_id,
        review=review.review,
        rating=review.rating,
        sentiment=predicted_sentiment
    )


    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review


def get_all_reviews(db: Session):
    return db.query(Review).all()