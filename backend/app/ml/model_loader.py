from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "models"

svm_model = joblib.load(
    MODEL_DIR / "face_recognition_svm.pkl"
)

label_encoder = joblib.load(
    MODEL_DIR / "label_encoder.pkl"
)