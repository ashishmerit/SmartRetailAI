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


app = FastAPI(
    title="Smart Retail AI API",
    description="AI-Powered Smart Retail & Customer Intelligence Platform",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

app.include_router(customer_router)
app.include_router(visit_router)
app.include_router(review_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Smart Retail AI API 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "Running",
        "version": "1.0.0"
    }