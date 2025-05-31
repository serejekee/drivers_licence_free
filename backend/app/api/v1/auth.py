from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas.auth import Token, UserLogin, UserRegister
from ...schemas.user import User, UserCreate
from ...crud.user import authenticate_user, create_user, get_user_by_username, get_user_by_email
from ...core.security import create_access_token
from ...services.auth import get_current_active_user

router = APIRouter()


@router.post("/register", response_model=User)
def register(user: UserRegister, db: Session = Depends(get_db)):
    # Check if user exists
    if get_user_by_username(db, username=user.username):
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    if get_user_by_email(db, email=user.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Create user
    user_create = UserCreate(
        username=user.username,
        email=user.email,
        password=user.password,
        first_name=user.first_name,
        last_name=user.last_name
    )
    return create_user(db=db, user=user_create)


@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(subject=user.username)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
