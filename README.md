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

🚧 Visit Workflow Integration

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