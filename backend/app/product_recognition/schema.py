from pydantic import BaseModel


class BoundingBox(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int


class ProductPrediction(BaseModel):
    product: str
    confidence: float
    bbox: BoundingBox