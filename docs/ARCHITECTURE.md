# SmartRetailAI Architecture

## Overview

SmartRetailAI is built using a modular service-oriented architecture where each business domain is isolated into its own module. The system combines traditional backend development with multiple Artificial Intelligence components including Computer Vision, Machine Learning, Natural Language Processing, and Large Language Models.

---

# High Level Architecture

```
                         Client
                (React / Mobile / Swagger)

                           │
                           ▼

                    FastAPI Backend

                           │

 ┌──────────────┬──────────────┬──────────────┐
 │              │              │              │
 ▼              ▼              ▼              ▼

Customer      Visit        Review        Chatbot

 │              │              │              │

 └──────────────┼──────────────┼──────────────┘
                │
                ▼

          SQLAlchemy ORM

                │

                ▼

             SQLite DB

                │

────────────────────────────────────────────

               AI Layer

Face Recognition
FaceNet512 + SVM

Product Detection
YOLO11

Sentiment Analysis
TF-IDF + Logistic Regression

Shopping Assistant
Google Gemini 2.5 Flash
```

---

# Backend Structure

```
backend
│
├── app
│
├── core
│
├── database
│
├── customer
│
├── enrollment
│
├── visit
│
├── review
│
├── chat
│
├── ml
│
└── tests
```

---

# Module Responsibilities

## Customer Module

Responsible for

- Customer CRUD
- Customer information
- Database relationships

---

## Enrollment Module

Responsible for

- Registering new customers
- Saving customer face images
- Generating FaceNet512 embeddings
- Updating face datasets

---

## Visit Module

Responsible for

- Customer recognition
- Visit logging
- Confidence prediction

---

## Review Module

Responsible for

- Customer reviews
- Ratings
- Sentiment prediction

---

## Chat Module

Responsible for

- Rule Engine
- Gemini Integration
- Conversation Memory
- Chat History

---

## ML Module

Responsible for

- Face Recognition
- Product Detection
- Sentiment Analysis
- Model Loading
- Incremental Training

---

# AI Architecture

## Face Recognition Pipeline

```
Camera

↓

Face Image

↓

FaceNet512

↓

512-D Embedding

↓

SVM Classifier

↓

Customer Name
```

---

## Customer Enrollment Pipeline

```
Customer Registration

↓

Capture Face

↓

Save Image

↓

Generate Embedding

↓

Append Dataset

↓

Retrain Model

↓

Reload Model
```

---

## Product Detection Pipeline

```
Camera

↓

YOLO11

↓

Detected Products
```

---

## Sentiment Analysis Pipeline

```
Customer Review

↓

Text Cleaning

↓

TF-IDF

↓

Logistic Regression

↓

Positive / Negative
```

---

## Chatbot Pipeline

```
Customer Message

↓

Greeting Processing

↓

Rule Engine

↓

Known Intent?

├── Yes → Rule Response

└── No

↓

Gemini

↓

Conversation Memory

↓

Save Chat
```

---

# Database Relationships

```
Customer

│

├── Visits

├── Reviews

└── Chat Logs
```

---

# Design Principles

The backend follows these principles:

- Modular Architecture
- Separation of Concerns
- Service Layer Pattern
- Reusable AI Components
- Incremental Learning
- Thin Routers
- Business Logic inside Services

---

# AI Models

| Task | Model |
|-------|------|
| Face Recognition | FaceNet512 + SVM |
| Product Detection | YOLO11 |
| Sentiment Analysis | TF-IDF + Logistic Regression |
| Shopping Assistant | Gemini 2.5 Flash |

---

# Future Architecture

Future enhancements include

- PostgreSQL
- JWT Authentication
- Docker
- CI/CD
- Inventory Management
- Recommendation Engine
- Cloud Deployment