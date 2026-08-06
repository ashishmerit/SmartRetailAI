from app.ml.model_loader import (
    sentiment_model,
    tfidf_vectorizer
)


class SentimentAnalysisService:

    def __init__(self):

        self.model = sentiment_model

        self.vectorizer = tfidf_vectorizer

    def predict(self, review: str):

        review_vector = self.vectorizer.transform(
            [review]
        )

        prediction = self.model.predict(
            review_vector
        )[0]

        if prediction == 1:
            return "Positive"

        return "Negative"


sentiment_service = SentimentAnalysisService()