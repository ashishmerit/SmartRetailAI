from app.ml.model_loader import product_detector


class ProductRecognitionService:

    def __init__(self):
        self.model = product_detector

    def predict(self, image_path: str):

        results = self.model.predict(
            source=image_path,
            conf=0.25,
            verbose=False
        )

        products = []

        for box in results[0].boxes:

            cls = int(box.cls[0])
            confidence = float(box.conf[0])

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            products.append({
                "product": self.model.names[cls],
                "confidence": round(confidence * 100, 2),
                "bbox": {
                    "x1": round(x1),
                    "y1": round(y1),
                    "x2": round(x2),
                    "y2": round(y2)
                }
            })

        return products


product_service = ProductRecognitionService()