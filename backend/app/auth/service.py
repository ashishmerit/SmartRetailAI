from datetime import datetime, timedelta, timezone

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jose import jwt
from sqlalchemy.orm import Session

from app.auth.model import User
from app.customer.model import Customer
from app.core.config import settings


password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(
    password: str,
    password_hash: str,
) -> bool:

    try:
        return password_hasher.verify(
            password_hash,
            password,
        )

    except VerifyMismatchError:
        return False


def create_access_token(user: User) -> str:

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user.id),
        "role": user.role,
        "customer_id": user.customer_id,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def create_customer_account(
    db: Session,
    email: str,
    password: str,
):

    customer = (
        db.query(Customer)
        .filter(Customer.email == email)
        .first()
    )

    if customer is None:
        raise ValueError(
            "No customer exists with this email. "
            "Complete customer enrollment first."
        )

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise ValueError(
            "An account already exists for this email."
        )

    if customer.user is not None:
        raise ValueError(
            "This customer already has an account."
        )

    user = User(
        email=email,
        password_hash=hash_password(password),
        role="CUSTOMER",
        customer_id=customer.id,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        return None

    if not user.is_active:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    return user