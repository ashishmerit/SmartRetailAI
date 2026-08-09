from fastapi import APIRouter
from fastapi import Depends
from fastapi import UploadFile
from fastapi import File
from fastapi import Form

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.enrollment.schema import EnrollmentResponse
from app.enrollment.service import enroll_customer

from app.enrollment.service import retrain_face_service


router = APIRouter(

    prefix="/enrollment",

    tags=["Customer Enrollment"]

)

@router.post("/retrain")
def retrain():

    return retrain_face_service()

@router.post(

    "/customer",

    response_model=EnrollmentResponse

)

async def enroll(

    name: str = Form(...),

    email: str = Form(...),

    phone: str = Form(...),

    image: UploadFile = File(...),

    db: Session = Depends(get_db),

):

    return await enroll_customer(

        name,

        email,

        phone,

        image,

        db,

    )