# from datetime import datetime
# from pydantic import BaseModel


# class ChatCreate(BaseModel):
#     customer_id: int
#     user_message: str


# class ChatResponse(BaseModel):
#     id: int
#     customer_id: int
#     user_message: str
#     bot_response: str
#     timestamp: datetime

#     class Config:
#         from_attributes = True

from datetime import datetime
from pydantic import BaseModel, Field


class ChatCreate(BaseModel):
    customer_id: int
    user_message: str


class CustomerChatCreate(BaseModel):
    user_message: str = Field(min_length=1, max_length=4000)


class ChatResponse(BaseModel):
    id: int
    customer_id: int
    user_message: str
    bot_response: str
    timestamp: datetime

    class Config:
        from_attributes = True