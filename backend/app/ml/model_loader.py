from pathlib import Path
import joblib

from ultralytics import YOLO



# Project Root (D:/SmartRetailAI)
BASE_DIR = Path(__file__).resolve().parents[3]

# ML model directory
MODEL_DIR = BASE_DIR / "ml" / "saved_models"

# ----------------------------
# Face Recognition Models
# ----------------------------

SVM_MODEL_PATH = MODEL_DIR / "face_recognition_svm.pkl"
LABEL_ENCODER_PATH = MODEL_DIR / "label_encoder.pkl"


def load_face_models():
    svm = joblib.load(SVM_MODEL_PATH)
    encoder = joblib.load(LABEL_ENCODER_PATH)
    return svm, encoder


# Initial load
svm_model, label_encoder = load_face_models()

# ----------------------------
# Product Recognition Model
# ----------------------------

product_detector = YOLO(
    MODEL_DIR / "product_detector.pt"
)

# Sentiment Analysis
# -------------------------

sentiment_model = joblib.load(
    MODEL_DIR / "sentiment_model.pkl"
)

tfidf_vectorizer = joblib.load(
    MODEL_DIR / "tfidf_vectorizer.pkl"
)