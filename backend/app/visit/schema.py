from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from typing import Optional
from datetime import datetime



class VisitResponse(BaseModel):

    customer_id: int

    customer: str

    email: str

    phone: str

    confidence: float

    visit_time: Optional[datetime] = None

    location: str

    class Config:
        from_attributes = True