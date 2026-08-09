from sqlalchemy.orm import Session
from sqlalchemy import func

from app.chat.model import Chat
from app.chat.schema import ChatCreate

from app.customer.model import Customer
from app.visit.model import Visit
from app.review.model import Review

from app.chat.gemini import ask_gemini
from app.chat.prompts import build_prompt

# -----------------------------
# Intent Groups
# -----------------------------

GREETING_INTENTS = [
    "hello",
    "hi",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
]

NAME_INTENTS = [
    "what is my name",
    "who am i",
    "my name",
]

EMAIL_INTENTS = [
    "email",
    "mail",
    "email address",
]

PHONE_INTENTS = [
    "phone",
    "phone number",
    "mobile",
]

VISIT_COUNT_INTENTS = [
    "visit count",
    "how many visits",
    "times visited",
]

LATEST_VISIT_INTENTS = [
    "last visit",
    "latest visit",
    "when did i visit",
]

LATEST_REVIEW_INTENTS = [
    "latest review",
    "last review",
    "show my reviews",
    "show my review",
]

REVIEW_COUNT_INTENTS = [
    "review count",
    "how many reviews",
]

RATING_INTENTS = [
    "rating",
    "latest rating",
]

SENTIMENT_INTENTS = [
    "sentiment",
    "latest sentiment",
    "review sentiment",
]

FAREWELL_INTENTS = [
    "bye",
    "goodbye",
    "thanks",
    "thank you",
]


# -----------------------------
# Helper Functions
# -----------------------------

def save_chat(
    db: Session,
    customer_id: int,
    user_message: str,
    bot_response: str,
):
    chat = Chat(
        customer_id=customer_id,
        user_message=user_message,
        bot_response=bot_response,
    )

    db.add(chat)
    db.commit()


def latest_visit(db: Session, customer_id: int):
    return (
        db.query(Visit)
        .filter(Visit.customer_id == customer_id)
        .order_by(Visit.visit_time.desc())
        .first()
    )


def latest_review(db: Session, customer_id: int):
    return (
        db.query(Review)
        .filter(Review.customer_id == customer_id)
        .order_by(Review.id.desc())
        .first()
    )
def recent_chat_history(
    db: Session,
    customer_id: int,
    limit: int = 5,
):

    chats = (
        db.query(Chat)
        .filter(Chat.customer_id == customer_id)
        .order_by(Chat.timestamp.desc())
        .limit(limit)
        .all()
    )

    chats.reverse()

    history = []

    for chat in chats:

        history.append(
            f"User: {chat.user_message}"
        )

        history.append(
            f"Assistant: {chat.bot_response}"
        )

    return "\n".join(history)


# -----------------------------
# Main Chat Function
# -----------------------------

##heler func 

def extract_greeting(message: str):

    greeting = None

    cleaned = message

    for intent in GREETING_INTENTS:

        if cleaned.startswith(intent):

            greeting = intent

            cleaned = cleaned[len(intent):].strip(" ,.!?")

            break

    return greeting, cleaned

def create_chat(db: Session, chat: ChatCreate):

    customer = (
        db.query(Customer)
        .filter(Customer.id == chat.customer_id)
        .first()
    )

    if customer is None:
        raise ValueError("Customer not found")


    message = chat.user_message.lower().strip()

    greeting, message = extract_greeting(message)

    # ---------------- Greeting ----------------

    

    # ---------------- Name ----------------

    if any(intent in message for intent in NAME_INTENTS):

        response = f"Your name is {customer.name}."

    # ---------------- Email ----------------

    elif any(intent in message for intent in EMAIL_INTENTS):

        response = f"Your email is {customer.email}."

    # ---------------- Phone ----------------

    elif any(intent in message for intent in PHONE_INTENTS):

        response = f"Your phone number is {customer.phone}."

    # ---------------- Visit Count ----------------

    elif any(intent in message for intent in VISIT_COUNT_INTENTS):

        visits = (
            db.query(func.count(Visit.id))
            .filter(Visit.customer_id == customer.id)
            .scalar()
        )

        response = (
            f"You have visited the store {visits} time(s)."
        )

    # ---------------- Latest Visit ----------------

    elif any(intent in message for intent in LATEST_VISIT_INTENTS):

        visit = latest_visit(db, customer.id)

        if visit:

            response = (
                f"Your latest visit was on "
                f"{visit.visit_time}."
            )

        else:

            response = "You haven't visited the store yet."

    # ---------------- Latest Review ----------------

    elif any(intent in message for intent in LATEST_REVIEW_INTENTS):

        review = latest_review(db, customer.id)

        if review:

            response = (
                f'Your latest review was:\n"{review.review}"'
            )

        else:

            response = "You haven't submitted any reviews."

    # ---------------- Review Count ----------------

    elif any(intent in message for intent in REVIEW_COUNT_INTENTS):

        total = (
            db.query(func.count(Review.id))
            .filter(Review.customer_id == customer.id)
            .scalar()
        )

        response = (
            f"You have submitted {total} review(s)."
        )

    # ---------------- Rating ----------------

    elif any(intent in message for intent in RATING_INTENTS):

        review = latest_review(db, customer.id)

        if review:

            response = (
                f"Your latest rating is "
                f"{review.rating}/5."
            )

        else:

            response = "No ratings found."

    # ---------------- Sentiment ----------------

    elif any(intent in message for intent in SENTIMENT_INTENTS):

        review = latest_review(db, customer.id)

        if review:

            response = (
                f"Your latest review sentiment is "
                f"{review.sentiment}."
            )

        else:

            response = "No sentiment available."

    # ---------------- Farewell ----------------

    elif any(intent in message for intent in FAREWELL_INTENTS):

        response = (
            "Thank you for visiting Smart Retail AI. "
            "Have a wonderful day!"
        )

    # ---------------- Unknown ----------------

    else:

        visits = (db.query(func.count(Visit.id)).filter(Visit.customer_id == customer.id).scalar())

        review = latest_review(
            db,
            customer.id
        )

        sentiment = None

        if review:
            sentiment = review.sentiment

        history = recent_chat_history(db,customer.id,)

        prompt = build_prompt(

            customer_name=customer.name,

            user_message=chat.user_message,

            visits=visits,

            latest_sentiment=sentiment,

            conversation_history=history,
        )

        response = ask_gemini(prompt)

    if greeting:

        response = (
            f"Hello {customer.name}!\n\n"
            + response
        )

    chat_record = Chat(
        customer_id=customer.id,
        user_message=chat.user_message,
        bot_response=response,
    )

    db.add(chat_record)
    db.commit()
    db.refresh(chat_record)

    return chat_record

def get_all_chats(db: Session):

    return (
        db.query(Chat)
        .order_by(Chat.timestamp.desc())
        .all()
    )