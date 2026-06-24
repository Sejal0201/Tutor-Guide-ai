from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession

from app.database import get_db
from app.models.transcript import Transcript

from app.services.ai_service import (
    generate_reflection
)

router = APIRouter(
    prefix="/reflection",
    tags=["Reflection"]
)


@router.get("/{session_id}")
def get_reflection(
    session_id: int,
    db: DBSession = Depends(get_db)
):

    transcripts = (
        db.query(Transcript)
        .filter(
            Transcript.session_id == session_id
        )
        .all()
    )

    if not transcripts:
        return {
            "error": "No transcript found"
        }

    transcript_text = "\n".join(
        [
            f"{t.speaker}: {t.message}"
            for t in transcripts
        ]
    )

    report = generate_reflection(
        transcript_text
    )

    return {
        "reflection": report
    }