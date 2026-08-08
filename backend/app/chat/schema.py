from datetime import datetime
from pydantic import BaseModel


class ChatCreate(BaseModel):
    customer_id: int
    user_message: str


class ChatResponse(BaseModel):
    id: int
    customer_id: int
    user_message: str
    bot_response: str
    timestamp: datetime

    class Config:
        from_attributes = True