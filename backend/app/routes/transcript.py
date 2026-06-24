from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession

from app.database import get_db
from app.models.transcript import Transcript
from app.schemas.transcript import TranscriptCreate
from fastapi import UploadFile, File
from sqlalchemy.orm import Session as DBSession
from fastapi import Depends
from app.database import get_db
from app.models.transcript import Transcript
import os
import yt_dlp
from app.schemas.url_upload import (
    UrlUploadRequest
)

from app.services.whisper_service import (
    transcribe_audio
)
router = APIRouter(
    prefix="/transcript",
    tags=["Transcript"]
)

@router.post("/add")
def add_message(
    transcript: TranscriptCreate,
    db: DBSession = Depends(get_db)
):

    new_message = Transcript(
        session_id=transcript.session_id,
        speaker=transcript.speaker,
        message=transcript.message
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return {
        "message": "Transcript saved",
        "id": new_message.id
    }

@router.get("/{session_id}")
def get_transcript(
    session_id: int,
    db: DBSession = Depends(get_db)
):

    transcript = (
        db.query(Transcript)
        .filter(Transcript.session_id == session_id)
        .all()
    )

    return transcript

@router.post("/upload")
async def upload_audio(
    file: UploadFile = File(...)
):

    os.makedirs(
        "uploads",
        exist_ok=True
    )

    file_path = (
        f"uploads/{file.filename}"
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        buffer.write(
            await file.read()
        )

    transcript = (
        transcribe_audio(
            file_path
        )
    )

    return {
        "transcript": transcript
    }

@router.post("/from-url")
def transcribe_from_url(
    data: UrlUploadRequest
):
    os.makedirs(
        "uploads",
        exist_ok=True
    )

    output_file = (
        "uploads/video.%(ext)s"
    )

    ydl_opts = {
        "outtmpl": output_file,
        "format": "best"
    }

    with yt_dlp.YoutubeDL(
        ydl_opts
    ) as ydl:

        info = ydl.extract_info(
            data.url,
            download=True
        )

        downloaded_file = (
            ydl.prepare_filename(
                info
            )
        )

    transcript = (
        transcribe_audio(
            downloaded_file
        )
    )

    return {
        "transcript":
        transcript
    }   
    