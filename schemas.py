from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
class UserBase(BaseModel):
    username: str
    full_name: str
    role: str
class UserCreate(UserBase):
    password: str
class UserLogin(BaseModel):
    username: str
    password: str
class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
class PaymentCreate(BaseModel):
    user_id: int
    amount: float
class PaymentOut(BaseModel):
    id: int
    amount: float
    date: datetime
    user_id: int
    class Config:
        from_attributes = True