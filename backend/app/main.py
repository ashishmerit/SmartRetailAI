from app.core.config import settings

from fastapi import FastAPI

from app.database.database import engine
from app.database.base import Base

from app.customer.model import Customer
from app.visit.model import Visit
from app.review.model import Review
from app.chat.model import Chat

from app.customer.router import router as customer_router
from app.visit.router import router as visit_router
from app.review.router import router as review_router
from app.chat.router import router as chat_router

from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.exceptions import CustomerAlreadyExistsException

from app.face_recognition.router import router as face_router

from app.product_recognition.router import router as product_router

from app.enrollment.router import (router as enrollment_router)

from app.auth.model import User
from app.auth.router import router as auth_router


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Smart Retail & Customer Intelligence Platform",
    version=settings.PROJECT_VERSION,
)

@app.exception_handler(CustomerAlreadyExistsException)
async def customer_exists_exception_handler(
    request: Request,
    exc: CustomerAlreadyExistsException,
):
    return JSONResponse(
        status_code=409,
        content={
            "success": False,
            "message": exc.message,
            "error": "duplicate_email",
        },
    )

Base.metadata.create_all(bind=engine)

app.include_router(customer_router)
app.include_router(visit_router)
app.include_router(review_router)
app.include_router(chat_router)
app.include_router(product_router)
app.include_router(face_router) 
app.include_router(visit_router)
app.include_router(enrollment_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Smart Retail AI API 🚀"
    }


@app.get("/health")
def health():
    return {
        "status":"healthy",
        "project":"Smart Retail AI",
        "version":"1.0.0"
    }