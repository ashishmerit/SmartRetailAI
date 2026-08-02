from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import tempfile
import os

from app.ml.face_recognition import face_service
from app.face_recognition.schema import FaceRecognitionResponse

router = APIRouter(
    prefix="/face-recognition",
    tags=["Face Recognition"]
)

@router.post(
    "/predict",
    response_model=FaceRecognitionResponse
)
async def predict_face(
    file: UploadFile = File(...)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image files are allowed."
        )

    suffix = os.path.splitext(file.filename)[1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    try:
        result = face_service.predict(temp_path)
        return result
    finally:
        os.remove(temp_path)