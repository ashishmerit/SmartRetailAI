# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session

# from app.database.database import get_db

# from fastapi import HTTPException
# from app.auth.dependencies import require_admin
# from app.chat.model import Chat
# from app.customer.model import Customer

# from app.chat.schema import (
#     ChatCreate,
#     ChatResponse
# )

# from app.chat.service import (
#     create_chat,
#     get_all_chats
# )

# router = APIRouter(
#     prefix="/chat",
#     tags=["Chat"]
# )


# @router.post("/admin", response_model=ChatResponse)
# def admin_create_chat(
#     chat: ChatCreate,
#     db: Session = Depends(get_db),
#     current_admin=Depends(require_admin),
# ):
#     if db.query(Customer).filter(
#         Customer.id == chat.customer_id
#     ).first() is None:
#         raise HTTPException(status_code=404, detail="Customer not found")

#     return create_chat(db, chat)


# @router.get(
#     "/admin/{customer_id}",
#     response_model=list[ChatResponse],
# )
# def admin_get_customer_chats(
#     customer_id: int,
#     db: Session = Depends(get_db),
#     current_admin=Depends(require_admin),
# ):
#     if db.query(Customer).filter(
#         Customer.id == customer_id
#     ).first() is None:
#         raise HTTPException(status_code=404, detail="Customer not found")

#     return (
#         db.query(Chat)
#         .filter(Chat.customer_id == customer_id)
#         .order_by(Chat.timestamp.asc())
#         .all()
#     )

# @router.post(
#     "/",
#     response_model=ChatResponse
# )
# def create_chat_route(
#     chat: ChatCreate,
#     db: Session = Depends(get_db)
# ):

#     return create_chat(
#         db,
#         chat
#     )


# @router.get(
#     "/",
#     response_model=list[ChatResponse]
# )
# def get_chat_route(
#     db: Session = Depends(get_db)
# ):

#     return get_all_chats(db)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import require_customer
from app.auth.model import User
from app.chat.model import Chat
from app.chat.schema import CustomerChatCreate, ChatResponse, ChatCreate
from app.chat.service import create_chat
from app.database.database import get_db

router = APIRouter(prefix="/chat", tags=["Chat"])


def get_customer_id(current_user: User) -> int:
    if current_user.customer_id is None:
        raise HTTPException(
            status_code=403,
            detail="Customer profile is not linked to this account.",
        )
    return current_user.customer_id


@router.get("/me", response_model=list[ChatResponse])
def get_my_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_customer),
):
    customer_id = get_customer_id(current_user)

    return (
        db.query(Chat)
        .filter(Chat.customer_id == customer_id)
        .order_by(Chat.timestamp.asc())
        .all()
    )


@router.post("/me", response_model=ChatResponse)
def send_my_message(
    payload: CustomerChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_customer),
):
    customer_id = get_customer_id(current_user)

    service_payload = ChatCreate(
        customer_id=customer_id,
        user_message=payload.user_message.strip(),
    )

    return create_chat(db, service_payload)