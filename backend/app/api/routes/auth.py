from app.db.database import get_db
from app.schemas.schemas import (
    UserLoginRequest,
    UserLoginResponse,
    UserRegistrationRequest,
    UserRegistrationResponse,
)
from app.services import auth as auth_svc
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(tags=["Authentication - Users"])

@router.post("/register", response_model=UserRegistrationResponse, status_code=201)
async def register_user(payload: UserRegistrationRequest, db: AsyncSession = Depends(get_db)) -> UserRegistrationResponse:  # noqa: B008
    """Register a new user."""

    user = await auth_svc.register_user(payload, db)
    return user


@router.get("/verify-email")
async def verify_email(token: str = Query(..., description="Token from the verification email."), db: AsyncSession = Depends(get_db)) -> dict:  # noqa: B008
    """verify the email address from the link sent after registration."""

    return await auth_svc.verify_email(token, db)


@router.post("/login", response_model=UserLoginResponse)
async def login(payload: UserLoginRequest, request: Request, db: AsyncSession = Depends(get_db)):  # noqa: B008
    """Login with registred email and password."""

    return await auth_svc.login_user(payload, request, db)

@router.get("/me")
async def user_home():
    return {"message": "home page"}
