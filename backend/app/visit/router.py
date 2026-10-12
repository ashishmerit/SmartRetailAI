# from fastapi import APIRouter
# from fastapi import UploadFile
# from fastapi import File
# from fastapi import Depends

# from sqlalchemy.orm import Session

# from app.database.database import get_db

# from app.visit.schema import VisitResponse
# from app.visit.service import start_visit_service

# from app.auth.dependencies import require_admin
# from app.visit.model import Visit

# router = APIRouter(

#     prefix="/visit",

#     tags=["Customer Visit"]

# )


# @router.post(

#     "/start",

#     response_model=VisitResponse

# )

# @router.get("/", response_model=list[VisitResponse])
# def get_all_visits(
#     db: Session = Depends(get_db),
#     current_admin=Depends(require_admin),
# ):
#     return (
#         db.query(Visit)
#         .order_by(Visit.visit_time.desc())
#         .all()
#     )

# async def start_visit(

#     image: UploadFile = File(...),

#     db: Session = Depends(get_db)

# ):

#     return start_visit_service(

#         image,

#         db

#     )


from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.visit.schema import VisitResponse
from app.visit.service import start_visit_service
from app.auth.dependencies import require_admin
from app.visit.model import Visit

router = APIRouter(
    prefix="/visit",
    tags=["Customer Visit"]
)


@router.post("/start", response_model=VisitResponse)
async def start_visit(
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return start_visit_service(image, db)


@router.get("/", response_model=list[VisitResponse])
def get_all_visits(
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin),
):
    return (
        db.query(Visit)
        .order_by(Visit.visit_time.desc())
        .all()
    )
