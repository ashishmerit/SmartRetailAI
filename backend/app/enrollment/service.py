from pathlib import Path
import shutil

from fastapi import UploadFile

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from torch import embedding

from app.customer.model import Customer
from app.core.exceptions import CustomerAlreadyExistsException
from app.core.logger import logger

from app.ml.face_utils import append_customer, generate_embedding
from app import customer

from app.ml.face_utils import (generate_embedding,append_customer,)

from app.ml.face_utils import train_face_model

from app.ml.face_utils import (
    append_customer,
    generate_embedding,
    train_face_model,
)

from app.ml.face_recognition import face_service

def retrain_face_service():

    stats = train_face_model()

    face_service.reload_models()

    stats["message"] = "Face recognition model reloaded successfully."

    return stats

async def enroll_customer(

    name: str,
    email: str,
    phone: str,
    image: UploadFile,
    db: Session,

):

    customer = Customer(

        name=name,
        email=email,
        phone=phone,

    )

    try:

        db.add(customer)
        db.commit()
        db.refresh(customer)

    except IntegrityError:

        db.rollback()
        raise CustomerAlreadyExistsException()

    upload_dir = Path("app/static/customer_faces")

    upload_dir.mkdir(

        parents=True,
        exist_ok=True,

    )

    image_path = upload_dir / f"{customer.id}.jpg"

    with open(image_path, "wb") as buffer:

        shutil.copyfileobj(
            image.file,
            buffer,
        )

    embedding = generate_embedding(str(image_path))

    dataset_size = append_customer(embedding,customer.name)
    print("Dataset size:", dataset_size)

    logger.info(f"Embedding added for " f"{customer.name}. " f"Dataset size: {dataset_size}")

    return {

        "customer_id": customer.id,

        "name": customer.name,

        "embedding_dimensions": len(embedding),

        "message": "Customer enrolled successfully."

    }