from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import get_db
from backend.models import Payment, User
from backend.schemas import PaymentCreate, PaymentOut
from backend.auth import get_current_user
from typing import List
router = APIRouter()
@router.post("/record", response_model=PaymentOut)
def create_payment(payment: PaymentCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user['role'] != 'maestro':
        raise HTTPException(status_code=403, detail="Only teachers can register payments")
    db_payment = Payment(amount=payment.amount, user_id=payment.user_id)
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment
@router.get("/user/{user_id}", response_model=List[PaymentOut])
def get_user_payments(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user['role'] != 'maestro' and current_user['id'] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these payments")
    return db.query(Payment).filter(Payment.user_id == user_id).all()
@router.get("/summary/{user_id}")
def get_payment_summary(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user['role'] != 'maestro' and current_user['id'] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    # Use SQLAlchemy aggregation for performance
    summary = db.query(func.sum(Payment.amount), func.count(Payment.id)).filter(Payment.user_id == user_id).first()
    total = summary[0] or 0.0
    count = summary[1] or 0
    return {"total_paid": total, "count": count}
@router.get("/my-status")
def get_my_status(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user['id']
    payments = db.query(Payment).filter(Payment.user_id == user_id).order_by(Payment.date.desc()).all()
    # Example logic for balance and pending days
    total_paid = db.query(func.sum(Payment.amount)).filter(Payment.user_id == user_id).scalar() or 0.0
    return {
        "balance": 100000 - total_paid, # Example fixed target
        "payments": payments,
        "pendingDays": 5 # Example logic
    }