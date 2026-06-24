from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.session import Session as TutorSession
from app.models.transcript import Transcript

router = APIRouter(
    prefix="/insights",
    tags=["Insights"]
)

@router.get("/")
def get_insights(db: Session = Depends(get_db)):

    total_sessions = db.query(TutorSession).count()

    completed_sessions = (
        db.query(TutorSession)
        .filter(TutorSession.status == "completed")
        .count()
    )

    total_transcripts = db.query(Transcript).count()

    return {
        "stats": {
            "total_sessions": total_sessions,
            "completed_sessions": completed_sessions,
            "total_transcripts": total_transcripts,
            "coaching_score": 8.5
        },

        "misconceptions": [
            {
                "topic": "Linked List Memory",
                "count": 5
            },
            {
                "topic": "Algebra Sign Errors",
                "count": 3
            }
        ],

        "recommendations": [
            "Use visual diagrams for linked lists.",
            "Ask students to explain their reasoning.",
            "Use real-world examples."
        ]
    }