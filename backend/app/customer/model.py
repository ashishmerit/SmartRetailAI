from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    phone = Column(String, nullable=False)

    loyalty_points = Column(Integer, default=0)

    visits = relationship(
        "Visit",
        back_populates="customer",
        cascade="all, delete-orphan"
    )

    reviews = relationship(
        "Review",
        back_populates="customer",
        cascade="all, delete-orphan"
    )

    chats = relationship(
        "Chat",
        back_populates="customer",
        cascade="all, delete-orphan"
    )