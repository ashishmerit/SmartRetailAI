# SmartRetailAI API Reference

Base URL

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

# Customer API

## Create Customer

```
POST /customer
```

Creates a customer without facial enrollment.

Recommended only for testing.

---

## Get Customers

```
GET /customer
```

Returns all customers.

---

# Enrollment API

## Enroll Customer

```
POST /enrollment/customer
```

Form Data

| Field | Type |
|--------|------|
| name | string |
| email | string |
| phone | string |
| image | file |

Response

```json
{
  "customer_id": 1,
  "name": "John",
  "embedding_dimensions": 512
}
```

---

## Retrain Face Recognition

```
POST /enrollment/retrain
```

Retrains

- Label Encoder
- SVM Classifier

Reloads the models without restarting the backend.

---

# Visit API

## Start Visit

```
POST /visit/start
```

Form Data

| Field | Type |
|--------|------|
| image | file |

Response

```json
{
  "customer":"John",
  "confidence":98.72
}
```

---

# Product Recognition API

## Detect Products

```
POST /product/detect
```

Input

Image

Output

Detected products

Example

```json
{
  "products":[
      "Milk",
      "Bread",
      "Chocolate"
  ]
}
```

---

# Review API

## Submit Review

```
POST /reviews
```

Request

```json
{
  "customer_id":1,
  "review":"Great service",
  "rating":5
}
```

Response

```json
{
  "id":1,
  "sentiment":"Positive"
}
```

---

## Get Reviews

```
GET /reviews
```

Returns all reviews.

---

# Chat API

## Chat

```
POST /chat
```

Request

```json
{
  "customer_id":1,
  "user_message":"Recommend healthy snacks."
}
```

Response

```json
{
  "bot_response":"..."
}
```

Features

- Rule Engine
- Gemini
- Conversation Memory
- Customer Context

---

## Chat History

```
GET /chat
```

Returns previous conversations.

---

# Face Recognition Workflow

```
Customer

↓

Enrollment

↓

Embedding

↓

Dataset Update

↓

Retraining

↓

Model Reload

↓

Recognition
```

---

# Status Codes

| Code | Meaning |
|-------|---------|
|200|Success|
|201|Created|
|400|Bad Request|
|404|Not Found|
|409|Conflict|
|500|Internal Server Error|

---

# Authentication

Currently authentication is not implemented.

This will be introduced in a future release using JWT-based authentication.

---

# Future API

Planned endpoints

```
POST /auth/login

POST /auth/register

GET /dashboard

GET /analytics

GET /inventory

POST /recommendations
```