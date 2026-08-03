from pathlib import Path
import shutil

from fastapi import APIRouter, UploadFile, File

from app.product_recognition.product_recognition import product_service
from app.product_recognition.schema import ProductPrediction

router = APIRouter(prefix="/products", tags=["Product Recognition"])


@router.post(
    "/predict",
    response_model=list[ProductPrediction]
)
async def predict_product(
    image: UploadFile = File(...)
):

    upload_dir = Path("app/static/uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)

    image_path = upload_dir / image.filename

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    predictions = product_service.predict(str(image_path))

    return predictions