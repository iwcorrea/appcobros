from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routers import users, payments
import os
Base.metadata.create_all(bind=engine)
app = FastAPI(title="Cobros Diarios API")
# Restrict CORS to specific domains
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://app.cobros.com",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(payments.router, prefix="/payments", tags=["Payments"])
@app.get("/")
async def root():
    return {"message": "API de Gestión de Cobros Diarios Operativa"}