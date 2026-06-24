from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.session import Session as SessionModel
from app.models.transcript import Transcript

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats")
def dashboard_stats(
    db: Session = Depends(get_db)
):

    total_sessions = db.query(SessionModel).count()

    completed_sessions = (
        db.query(SessionModel)
        .filter(SessionModel.status == "completed")
        .count()
    )

    active_sessions = (
        db.query(SessionModel)
        .filter(SessionModel.status == "active")
        .count()
    )

    total_transcripts = db.query(Transcript).count()

    return {
        "total_sessions": total_sessions,
        "completed_sessions": completed_sessions,
        "active_sessions": active_sessions,
        "total_transcripts": total_transcripts
    }