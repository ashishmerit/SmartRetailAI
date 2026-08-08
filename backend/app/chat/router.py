from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.chat.schema import (
    ChatCreate,
    ChatResponse
)

from app.chat.service import (
    create_chat,
    get_all_chats
)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post(
    "/",
    response_model=ChatResponse
)
def create_chat_route(
    chat: ChatCreate,
    db: Session = Depends(get_db)
):

    return create_chat(
        db,
        chat
    )


@router.get(
    "/",
    response_model=list[ChatResponse]
)
def get_chat_route(
    db: Session = Depends(get_db)
):

    return get_all_chats(db)