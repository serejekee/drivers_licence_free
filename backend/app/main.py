from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1 import auth, user, admin, questions, exam_results
from .core.config import settings
from .db.session import engine
from .models import user as user_models, questions as questions_models, exam_results as exam_results_models

# Create database tables
user_models.Base.metadata.create_all(bind=engine)
questions_models.Base.metadata.create_all(bind=engine)
exam_results_models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DTTP in Korea",
    description="A web application to prepare for the Korean driving license exam. Includes training mode, exams, "
                "and performance tracking.",
    version="1.0.0",
    debug=settings.debug
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(user.router, prefix="/api/v1/user", tags=["user"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(questions.router, prefix="/api/v1/questions", tags=["questions"])
app.include_router(exam_results.router, prefix="/api/v1/exams", tags=["exam_results"])


@app.get("/")
def read_root():
    return {"message": "Welcome to DTTP in Korea"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
