from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User
from backend.schemas import UserCreate, UserOut, Token, UserLogin
from backend.auth import get_password_hash, verify_password, create_access_token, get_current_user
router = APIRouter()
@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_pw = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_pw, role=user.role, full_name=user.full_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
@router.post("/login", response_model=Token)
def login(form_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username, "role": user.role, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}
@router.get("/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user['id']).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
@router.get("/clientes", response_model=List[UserOut])
def get_clientes(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user['role'] != 'maestro':
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(User).filter(User.role == 'cliente').all()