from datetime import datetime
from pydantic import BaseModel


class VisitCreate(BaseModel):
    customer_id: int
    confidence: float
    location: str


class VisitResponse(BaseModel):
    id: int
    customer_id: int
    visit_time: datetime
    confidence: float
    location: str

    class Config:
        from_attributes = True