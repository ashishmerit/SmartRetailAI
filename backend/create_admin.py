from getpass import getpass

from app.auth.model import User
from app.auth.service import hash_password

# Import all models so SQLAlchemy can configure relationships
from app.customer.model import Customer
from app.visit.model import Visit
from app.review.model import Review
from app.chat.model import Chat

from app.database.database import SessionLocal


def create_admin():

    db = SessionLocal()

    try:

        email = input("Admin email: ").strip()
        password = getpass("Admin password: ")

        if not email or not password:
            print("Email and password are required.")
            return

        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:

            if existing_user.role == "ADMIN":
                print("An Admin account with this email already exists.")
                return

            print(
                f"A user with this email already exists "
                f"with role: {existing_user.role}"
            )
            print(
                "Use a different email or promote the existing "
                "account through an administrative operation."
            )
            return

        admin = User(
            email=email,
            password_hash=hash_password(password),
            role="ADMIN",
            customer_id=None,
            is_active=True,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print()
        print("Admin account created successfully.")
        print(f"Admin ID: {admin.id}")
        print(f"Email: {admin.email}")
        print(f"Role: {admin.role}")

    except Exception:

        db.rollback()
        raise

    finally:

        db.close()


if __name__ == "__main__":
    create_admin()