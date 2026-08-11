from pydantic import BaseModel, EmailStr


class CustomerAccountCreate(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    customer_id: int | None = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    customer_id: int | None
    is_active: bool

    class Config:
        from_attributes = True