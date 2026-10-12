
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import require_admin
from app.customer.model import Customer
from app.database.database import get_db
from app.review.model import Review
from app.visit.model import Visit
from collections import Counter
from app.visit.model import Visit

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/summary")
def get_analytics_summary(
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin),
):
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    tomorrow_start = today_start + timedelta(days=1)

    total_customers = db.query(Customer).count()

    visits_today = (
        db.query(Visit)
        .filter(
            Visit.visit_time >= today_start,
            Visit.visit_time < tomorrow_start,
        )
        .count()
    )

    total_visits = db.query(Visit).count()
    total_reviews = db.query(Review).count()

    positive_reviews = (
        db.query(Review)
        .filter(Review.sentiment.ilike("positive"))
        .count()
    )

    negative_reviews = (
        db.query(Review)
        .filter(Review.sentiment.ilike("negative"))
        .count()
    )

    return {
        "total_customers": total_customers,
        "visits_today": visits_today,
        "total_visits": total_visits,
        "total_reviews": total_reviews,
        "positive_reviews": positive_reviews,
        "negative_reviews": negative_reviews,
        "products_detected": None,
    }

@router.get("/details")
def get_analytics_details(
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin),
):
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=6)

    visits = (
        db.query(Visit)
        .filter(Visit.visit_time >= datetime.combine(
            start_date, datetime.min.time()
        ))
        .order_by(Visit.visit_time.asc())
        .all()
    )

    reviews = db.query(Review).all()

    daily_visits = Counter()
    for visit in visits:
        if visit.visit_time:
            daily_visits[visit.visit_time.date().isoformat()] += 1

    visit_trend = [
        {
            "date": (start_date + timedelta(days=i)).isoformat(),
            "count": daily_visits[
                (start_date + timedelta(days=i)).isoformat()
            ],
        }
        for i in range(7)
    ]

    rating_counts = Counter(
        review.rating for review in reviews if review.rating is not None
    )

    sentiment_counts = Counter(
        (review.sentiment or "Unknown").strip().title()
        for review in reviews
    )

    return {
        "visit_trend": visit_trend,
        "rating_distribution": [
            {"rating": rating, "count": rating_counts.get(rating, 0)}
            for rating in range(1, 6)
        ],
        "sentiment_distribution": [
            {"sentiment": sentiment, "count": count}
            for sentiment, count in sorted(sentiment_counts.items())
        ],
    }
