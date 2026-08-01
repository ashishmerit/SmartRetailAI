from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base


class Visit(Base):
    __tablename__ = "visits"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    visit_time = Column(DateTime, default=datetime.utcnow)

    confidence = Column(Float)

    location = Column(String)

    customer = relationship(
        "Customer",
        back_populates="visits"
    )