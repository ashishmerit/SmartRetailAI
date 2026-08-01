from sqlalchemy.orm import Session

from app.visit.model import Visit
from app.visit.schema import VisitCreate


def create_visit(db: Session, visit: VisitCreate):
    new_visit = Visit(
        customer_id=visit.customer_id,
        confidence=visit.confidence,
        location=visit.location,
    )

    db.add(new_visit)
    db.commit()
    db.refresh(new_visit)

    return new_visit


def get_all_visits(db: Session):
    return db.query(Visit).all()