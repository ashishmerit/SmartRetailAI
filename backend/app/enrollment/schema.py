from pydantic import BaseModel


class EnrollmentResponse(BaseModel):

    customer_id: int

    name: str

    embedding_dimensions: int

    message: str