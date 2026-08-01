from sqlalchemy.orm import Session

from app.chat.model import Chat
from app.chat.schema import ChatCreate


def create_chat(db: Session, chat: ChatCreate):
    new_chat = Chat(
        customer_id=chat.customer_id,
        user_message=chat.user_message,
        bot_response=chat.bot_response
    )

    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    return new_chat


def get_all_chats(db: Session):
    return db.query(Chat).all()