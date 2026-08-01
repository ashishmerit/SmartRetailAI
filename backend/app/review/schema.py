from pydantic import BaseModel


class ReviewCreate(BaseModel):
    customer_id: int
    review: str
    rating: int


class ReviewResponse(BaseModel):
    id: int
    customer_id: int
    review: str
    rating: int
    sentiment: str | None

    class Config:
        from_attributes = True