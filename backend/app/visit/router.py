from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.visit.schema import VisitCreate, VisitResponse
from app.visit.service import (
    create_visit,
    get_all_visits,
)

router = APIRouter(
    prefix="/visits",
    tags=["Visits"],
)


@router.post("/", response_model=VisitResponse)
def create_visit_route(
    visit: VisitCreate,
    db: Session = Depends(get_db),
):
    return create_visit(db, visit)


@router.get("/", response_model=list[VisitResponse])
def get_visits_route(
    db: Session = Depends(get_db),
):
    return get_all_visits(db)