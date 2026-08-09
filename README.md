# 🛒 SmartRetailAI

> An AI-powered retail management system that combines Computer Vision, Machine Learning, Natural Language Processing, and Generative AI to deliver an intelligent in-store customer experience.

---

## 📌 Overview

SmartRetailAI is a modular retail intelligence platform designed to enhance customer experience and assist retail store operations through AI.

The system integrates multiple AI technologies into a single backend application:

- Face Recognition for customer identification
- Product Recognition using YOLO object detection
- AI-powered shopping assistant using Google Gemini
- Customer review sentiment analysis
- Customer visit tracking
- Incremental face learning for new customer enrollment

The backend is built with **FastAPI** using a service-oriented architecture and is designed to support future frontend and deployment integrations.

---

# ✨ Features

## 👤 Customer Management

- Register and manage customers
- Store customer information
- Track customer visit history
- Maintain customer review history

---

## 😊 Face Recognition

Recognize returning customers using FaceNet512 embeddings and an SVM classifier.

Features:

- Customer identification
- Confidence score prediction
- Automatic visit logging
- Incremental customer enrollment
- Runtime model retraining
- Hot model reloading without restarting the backend

---

## 📦 Product Recognition

Detect retail products using a custom-trained YOLO model.

Capabilities:

- Product detection
- Multiple object detection
- Bounding box predictions
- Real-time inference support

---

## 💬 AI Shopping Assistant

Hybrid chatbot architecture combining deterministic rules with Google's Gemini LLM.

Capabilities include:

- Shopping assistance
- Product recommendations
- Healthy food suggestions
- Customer-specific information
- Retail-focused conversations
- Conversation memory

---

## 😊 Sentiment Analysis

Analyze customer reviews using a machine learning model trained on the IMDB dataset.

Pipeline:

- Text preprocessing
- TF-IDF vectorization
- Logistic Regression classifier

Predictions:

- Positive
- Negative

---

## 📝 Customer Reviews

- Submit reviews
- Store ratings
- Predict sentiment automatically
- View review history

---

## 🚶 Customer Visit Tracking

Automatically logs customer visits after successful face recognition.

Stored information includes:

- Customer
- Visit timestamp
- Recognition confidence

---

## 🧠 Incremental Learning

New customers can be enrolled without rebuilding the dataset manually.

Workflow:

1. Register customer
2. Capture face image
3. Generate FaceNet512 embedding
4. Update embedding dataset
5. Retrain SVM model
6. Reload recognition model

---

# 🏗️ System Architecture

```
                  Customer

                      │

              Camera / Frontend

                      │

          ┌───────────┴───────────┐

          │                       │

     Customer Enrollment      Customer Visit

          │                       │

          ▼                       ▼

   Face Embedding           Face Recognition

          │                       │

          ▼                       ▼

 Increment Dataset       Customer Identified

          │                       │

          └──────────────┬────────┘

                         │

                   Customer Database

                         │

      ┌──────────┬──────────┬────────────┐

      ▼          ▼          ▼            ▼

   Reviews    Products     Chatbot      Visits

      │          │           │

Sentiment     YOLO        Gemini AI
```

---

# 🛠️ Tech Stack

## Backend

- FastAPI
- SQLAlchemy
- SQLite

## Machine Learning

- Scikit-learn
- DeepFace
- FaceNet512
- OpenCV
- NumPy
- Pandas

## Computer Vision

- YOLO11
- Ultralytics

## Natural Language Processing

- TF-IDF
- Logistic Regression

## Generative AI

- Google Gemini 2.5 Flash

---

# 📂 Project Structure

```
SmartRetailAI
│
├── backend
│   ├── app
│   │   ├── chat
│   │   ├── customer
│   │   ├── enrollment
│   │   ├── ml
│   │   ├── product
│   │   ├── review
│   │   ├── visit
│   │   ├── database
│   │   └── core
│   │
│   └── tests
│
├── ml
│   ├── notebooks
│   ├── datasets
│   └── saved_models
│
└── README.md
```

---

# 🚀 API Modules

| Module | Status |
|---------|--------|
| Customer | ✅ |
| Enrollment | ✅ |
| Visit | ✅ |
| Review | ✅ |
| Chat | ✅ |
| Product Detection | ✅ |
| Face Recognition | ✅ |
| Sentiment Analysis | ✅ |

---

# 🧪 Machine Learning Models

| Task | Model |
|------|-------|
| Face Recognition | FaceNet512 + SVM |
| Product Detection | YOLO11 |
| Sentiment Analysis | TF-IDF + Logistic Regression |
| Shopping Assistant | Google Gemini 2.5 Flash |

---

# 🔄 Current Workflow

### New Customer

```
Customer Registration
        │
        ▼
Capture Face
        │
        ▼
Generate Face Embedding
        │
        ▼
Update Dataset
        │
        ▼
Retrain Recognition Model
        │
        ▼
Customer Ready
```

### Returning Customer

```
Camera
    │
    ▼
Face Recognition
    │
    ▼
Known Customer
    │
    ▼
Visit Logged
```

---

# 📈 Future Work

## Backend Enhancements

- JWT authentication and role-based access control
- PostgreSQL/MySQL support
- Inventory-aware AI assistant
- Automatic scheduled model retraining
- Model versioning and metadata
- WebSocket support for real-time notifications
- Docker containerization
- Comprehensive unit and integration tests
- CI/CD pipeline

---

## Frontend Development

A React-based frontend will be developed to provide a complete end-to-end retail management experience.

Planned features include:

- Customer dashboard
- Customer enrollment interface
- Live face recognition
- Product detection dashboard
- AI shopping assistant interface
- Customer review portal
- Analytics dashboard
- Admin panel
- Responsive mobile-friendly UI

---

# 🎯 Project Status

**Backend:** ✅ Feature Complete

The backend currently provides a complete AI-powered retail management platform with integrated machine learning, computer vision, sentiment analysis, and generative AI.

Frontend development and deployment are work in progress.

---

# 👨‍💻 Author

**Ashish Ranjan**
Final Year B.Tech student

