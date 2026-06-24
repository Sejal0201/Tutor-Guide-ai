# from fastapi import FastAPI

# from app.database import engine, Base
# from app.models.user import User

# Base.metadata.create_all(bind=engine)

# app = FastAPI()


# @app.get("/")
# def home():
#     return {
#         "message": "TutorGuide AI Backend Running"
#     }

from fastapi import FastAPI

from app.database import engine, Base
from app.models.user import User
from app.routes import dashboard
from app.routes.auth import router as auth_router
from app.models.session import Session
from app.routes.session import router as session_router
from app.models.session import Session
from app.models.transcript import Transcript
from app.routes.transcript import router as transcript_router
from app.routes.ai import router as ai_router
from app.routes.transcription import router as transcription_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.export import router as export_router
from app.routes.reflection import router as reflection_router
from app.routes.insights import router as insights_router


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(insights_router)
app.include_router(dashboard.router)
app.include_router(export_router)
app.include_router(reflection_router)
app.include_router(
    transcription_router
)
app.include_router(session_router)
app.include_router(ai_router)
app.include_router(transcript_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {
        "message": "TutorGuide AI Backend Running"
    }