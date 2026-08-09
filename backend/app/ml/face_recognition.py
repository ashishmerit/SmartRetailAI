from pathlib import Path

import cv2
import numpy as np
from deepface import DeepFace

from app.ml.model_loader import (
    load_face_models,
)

class FaceRecognitionService:

    def __init__(self):
        self.reload_models()

    def reload_models(self):

        self.model, self.encoder = load_face_models()

        print("Face Recognition models reloaded successfully.")

    def generate_embedding(self, image_path: str):

        embedding = DeepFace.represent(
            img_path=image_path,
            model_name="Facenet512",
            detector_backend="mtcnn",
            enforce_detection=False
        )[0]["embedding"]

        return np.array(embedding)

    def predict(self, image_path: str):

        embedding = self.generate_embedding(image_path)

        prediction = self.model.predict(embedding.reshape(1, -1))[0]

        probabilities = self.model.predict_proba(embedding.reshape(1, -1))[0]

        score = float(np.max(probabilities))

        # UNKNOWN THRESHOLD = 0.50
        # if score < 0.50:
        #     return {
        #         "customer": "Unknown",
        #         "confidence": round(score * 100, 2)
        #     }

        customer = self.encoder.inverse_transform(
            [prediction]
        )[0]

        return {
            "customer": customer,
            "confidence": round(score * 100, 2)
        }
face_service = FaceRecognitionService()