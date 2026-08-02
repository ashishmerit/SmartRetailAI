from pydantic import BaseModel


class FaceRecognitionResponse(BaseModel):
    customer: str
    confidence: float