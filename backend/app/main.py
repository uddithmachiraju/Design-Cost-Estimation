from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.api.routes import auth as auth_routes
from app.api.routes import estimations as estimation_routes
from app.config.logging import get_logger, setup_logging
from app.config.settings import settings
from app.db.database import Base, engine

setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("app_starting", env=settings.ENV, version=settings.APP_VERSION)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.execute(text("CREATE SEQUENCE IF NOT EXISTS estimation_code_seq"))
        await conn.execute(text("SELECT nextval('estimation_code_seq')"))
        logger.info("database_connected", env=settings.ENV,
                    version=settings.APP_VERSION)
    yield
    await engine.dispose()
    logger.info("app_stopping", env=settings.ENV, version=settings.APP_VERSION)


app = FastAPI(
    title="Cost Estimation API",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGIN, allow_methods=["*"], allow_credentials=True, allow_headers=["*"])


app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication - Users"])
app.include_router(estimation_routes.router, prefix="/api", tags=["Estimations"])

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", error=str(exc), path=request.url.path)
    return JSONResponse(status_code=500, content={"error": "Internal Server Error", "message": f"An unexpected error occurred {str(exc)}."})


@app.get("/", include_in_schema=False)
async def root() -> dict:
    return {"service": settings.APP_NAME, "version": settings.APP_VERSION, "env": settings.ENV}
