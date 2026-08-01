from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    review = Column(String)

    rating = Column(Integer)

    sentiment = Column(String)

    customer = relationship(
        "Customer",
        back_populates="reviews"
    )