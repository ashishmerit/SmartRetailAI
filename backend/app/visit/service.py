from pathlib import Path
import shutil

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.customer.service import get_customer_by_name
from app.ml.face_recognition import face_service
from app.visit.model import Visit


def start_visit_service(
    image: UploadFile,
    db: Session
):

    upload_dir = Path("app/static/uploads")
    upload_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    image_path = upload_dir / image.filename

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(
            image.file,
            buffer
        )

    prediction = face_service.predict(
        str(image_path)
    )

    customer = get_customer_by_name(
        db,
        prediction["customer"]
    )

    if customer is None:
        return {
            "customer_id": 0,
            "customer": prediction["customer"],
            "email": "",
            "phone": "",
            "confidence": prediction["confidence"],
            "visit_time": None,
            "location": "Unknown"
        }

    visit = Visit(

        customer_id=customer.id,

        confidence=prediction["confidence"],

        location="Store Entrance"

    )

    db.add(visit)

    db.commit()

    db.refresh(visit)

    return {

        "customer_id": customer.id,

        "customer": customer.name,

        "email": customer.email,

        "phone": customer.phone,

        "confidence": prediction["confidence"],

        "visit_time": visit.visit_time,

        "location": visit.location

    }