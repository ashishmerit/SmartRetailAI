# 🛒 SmartRetailAI

An AI-powered smart retail system that combines Computer Vision, Machine Learning and FastAPI to provide intelligent customer interaction inside a retail environment.

---

# Features

## 👤 Face Recognition

- Customer identification using FaceNet512 embeddings
- DeepFace for embedding extraction
- SVM classifier for identity prediction
- FastAPI inference API

---

## 🛍 Product Recognition

- YOLO11 object detection
- Grocery product detection
- Bounding box prediction
- Confidence scores
- FastAPI inference API

---

## 😊 Sentiment Analysis (Upcoming)

- Customer review sentiment classification
- Positive / Neutral / Negative prediction

---

## 🤖 Retail Chatbot (Upcoming)

- AI shopping assistant
- Product recommendation
- Customer assistance
- Review analysis integration

---

# Tech Stack

## Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Uvicorn

## Machine Learning

- DeepFace
- FaceNet512
- YOLO11
- Scikit-Learn
- TensorFlow
- PyTorch
- Ultralytics

## Frontend (Upcoming)

- React
- Vite
- TailwindCSS
- shadcn/ui

---

# Project Structure

```
SmartRetailAI/

backend/
    app/
        chat/
        customer/
        database/
        face_recognition/
        ml/
        product_recognition/
        review/
        visit/

ml/
    datasets/
    notebooks/
    saved_models/
```

---

# ML Pipelines

## Face Recognition

Image

↓

DeepFace

↓

FaceNet512 Embeddings

↓

SVM

↓

Customer Prediction

---

## Product Recognition

Image

↓

YOLO11

↓

Bounding Boxes

↓

Detected Products

---

# Current Status

✅ Backend Foundation

✅ Database

✅ Customer Module

✅ Visit Module

✅ Face Recognition ML Pipeline

✅ Face Recognition API

✅ Product Recognition ML Pipeline

✅ Product Recognition API

✅ Customer Visit Workflow
- Face recognition identifies customer.
- Customer lookup is performed using SQLAlchemy.
- Visit records are created and stored in the database.
- End-to-end API verified using Swagger.

✅ Review Management
- Customers can submit reviews through the API.
- Reviews are linked to registered customers.
- Reviews are accepted only if the customer has a recorded visit.
- Review sentiment is currently stored as NULL and will be populated automatically in the upcoming Sentiment Analysis module.

⬜ Sentiment Analysis

⬜ Retail Chatbot

⬜ Frontend

---

# Future Scope

- Customer Enrollment using Face Embeddings
- Real-time Webcam Recognition
- Live Product Detection
- Review Sentiment Analysis
- AI Chatbot
- Personalized Recommendations
- Analytics Dashboard
- Transition from dataset-based recognition to production identity management.
- Google Colab used for training large ML models; backend performs inference using exported models only.

---

# Author

Ashish Ranjan