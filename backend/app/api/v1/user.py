from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas.user import User, UserUpdate, ChangePassword
from ...crud.user import update_user, change_user_password
from ...services.auth import get_current_active_user
from ...models.user import User as UserModel
from ...core.security import verify_password

router = APIRouter()


@router.get("/profile", response_model=User)
def get_user_profile(current_user: UserModel = Depends(get_current_active_user)):
    return current_user


@router.put("/profile", response_model=User)
def update_user_profile(
        user_update: UserUpdate,
        current_user: UserModel = Depends(get_current_active_user),
        db: Session = Depends(get_db)
):
    return update_user(db=db, db_user=current_user, user_update=user_update)


@router.put("/change-password")
def change_password(
        password_data: ChangePassword,
        current_user: UserModel = Depends(get_current_active_user),
        db: Session = Depends(get_db)
):
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    # Update password
    change_user_password(db=db, user=current_user, new_password=password_data.new_password)
    
    return {"message": "Password updated successfully"}
