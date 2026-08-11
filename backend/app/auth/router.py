from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.auth.schema import (
    CustomerAccountCreate,
    LoginRequest,
    TokenResponse,
    UserResponse,
)
from app.auth.service import (
    authenticate_user,
    create_access_token,
    create_customer_account,
)
from app.auth.dependencies import get_current_user
from app.database.database import get_db

from app.auth.dependencies import (
    get_current_user,
    require_admin,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register/customer",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_customer(
    account: CustomerAccountCreate,
    db: Session = Depends(get_db),
):

    try:

        return create_customer_account(
            db,
            account.email,
            account.password,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db),
):

    user = authenticate_user(
        db,
        credentials.email,
        credentials.password,
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    token = create_access_token(user)

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "customer_id": user.customer_id,
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user=Depends(get_current_user),
):

    return current_user

@router.post(
    "/token",
    response_model=TokenResponse,
)
def token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(
        db,
        form_data.username,
        form_data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    access_token = create_access_token(user)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "customer_id": user.customer_id,
    }

#temp admin test

@router.get("/admin-test")
def admin_test(
    current_user=Depends(require_admin),
):
    return {
        "message": "Admin access granted.",
        "user_id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
    }