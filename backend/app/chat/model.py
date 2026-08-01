from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base


class Chat(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    user_message = Column(String)

    bot_response = Column(String)

    timestamp = Column(DateTime, default=datetime.utcnow)

    customer = relationship(
        "Customer",
        back_populates="chats"
    )