from pydantic import BaseModel


class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: str


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    loyalty_points: int

    class Config:
        from_attributes = True