from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.visit.schema import VisitResponse
from app.visit.service import start_visit_service

router = APIRouter(

    prefix="/visit",

    tags=["Customer Visit"]

)


@router.post(

    "/start",

    response_model=VisitResponse

)

async def start_visit(

    image: UploadFile = File(...),

    db: Session = Depends(get_db)

):

    return start_visit_service(

        image,

        db

    )