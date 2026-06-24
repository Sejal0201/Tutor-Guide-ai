from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from sqlalchemy.orm import Session as DBSession
# from app.models.reflection import Reflection
from app.database import get_db
from app.models.session import Session
from app.services.ai_service import generate_reflection
from app.models.transcript import Transcript

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

router = APIRouter(
    prefix="/export",
    tags=["Export"]
)


@router.get("/report/{session_id}")
def export_report(
    session_id: int,
    db: DBSession = Depends(get_db)
):

    session = (
        db.query(Session)
        .filter(Session.id == session_id)
        .first()
    )

    transcripts = (
        db.query(Transcript)
        .filter(
            Transcript.session_id == session_id
        )
        .all()
    )

    transcript_text = "\n".join(
        [
            f"{t.speaker}: {t.message}"
            for t in transcripts
        ]
    )

    reflection_report = generate_reflection(
        transcript_text
    )

    pdf_path = (
        f"session_{session_id}.pdf"
    )

    doc = SimpleDocTemplate(
        pdf_path
    )

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            "TutorGuide AI Report",
            styles["Title"]
        )
    )

    content.append(
        Spacer(1, 12)
    )

    content.append(
        Paragraph(
            f"Subject: {session.subject}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Topic: {session.topic}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Status: {session.status}",
            styles["Normal"]
        )
    )

    content.append(
        Spacer(1, 12)
    )

    content.append(
        Paragraph(
            "Transcript",
            styles["Heading2"]
        )
    )

    for item in transcripts:
        content.append(
            Paragraph(
                f"{item.speaker}: {item.message}",
                styles["Normal"]
            )
        )

    content.append(
        Spacer(1, 12)
    )

    content.append(
        Paragraph(
            "AI Reflection",
            styles["Heading2"]
        )
    )

    content.append(
        Paragraph(
            reflection_report.replace("\n", "<br/>"),
            styles["Normal"]
        )
    )

    doc.build(content)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"session_{session_id}.pdf"
    )