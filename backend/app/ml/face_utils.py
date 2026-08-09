from pathlib import Path

import joblib
import numpy as np
from deepface import DeepFace
from sklearn.preprocessing import LabelEncoder
from sklearn.svm import SVC


BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_DIR = BASE_DIR / "ml" / "saved_models"


EMBEDDINGS_FILE = MODEL_DIR / "embeddings.npy"
LABELS_FILE = MODEL_DIR / "labels.npy"

SVM_MODEL_FILE = MODEL_DIR / "face_recognition_svm.pkl"
LABEL_ENCODER_FILE = MODEL_DIR / "label_encoder.pkl"


# ----------------------------------------------------
# Embedding Generation
# ----------------------------------------------------

def generate_embedding(image_path: str):

    embedding = DeepFace.represent(

        img_path=image_path,

        model_name="Facenet512",

        detector_backend="mtcnn",

        enforce_detection=False,

    )[0]["embedding"]

    return np.array(embedding)


# ----------------------------------------------------
# Dataset Helpers
# ----------------------------------------------------

def load_dataset():

    embeddings = np.load(EMBEDDINGS_FILE)

    labels = np.load(LABELS_FILE)

    return embeddings, labels


def save_dataset(

    embeddings,

    labels,

):

    np.save(

        EMBEDDINGS_FILE,

        embeddings,

    )

    np.save(

        LABELS_FILE,

        labels,

    )


def append_customer(

    embedding,

    customer_name,

):

    embeddings, labels = load_dataset()

    embeddings = np.vstack(

        [

            embeddings,

            embedding,

        ]

    )

    labels = np.append(

        labels,

        customer_name,

    )

    save_dataset(

        embeddings,

        labels,

    )

    return len(labels)


# ----------------------------------------------------
# Model Training (Sprint 8.3B)
# ----------------------------------------------------
def train_face_model():

    embeddings, labels = load_dataset()

    encoder = LabelEncoder()

    encoded_labels = encoder.fit_transform(labels)

    svm = SVC(

        kernel="linear",

        probability=True,

        random_state=42,

    )

    svm.fit(

        embeddings,

        encoded_labels,

    )

    joblib.dump(

        svm,

        SVM_MODEL_FILE,

    )

    joblib.dump(

        encoder,

        LABEL_ENCODER_FILE,

    )

    return {

        "samples": len(labels),

        "classes": len(encoder.classes_)

    }