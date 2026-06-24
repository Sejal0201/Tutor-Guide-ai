# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session as DBSession
# from datetime import datetime

# from app.database import get_db
# from app.models.session import Session 
# from app.schemas.session import SessionCreate
# from datetime import datetime

# from app.models.transcript import Transcript
# from app.schemas.transcript_save import TranscriptSaveRequest

# router = APIRouter(
#     prefix="/session",
#     tags=["Session"]
# )

# @router.post("/start")
# def start_session(
#     session_data: SessionCreate,
#     db: DBSession = Depends(get_db)
# ):
#     new_session = Session(
#         tutor_id=1,
#         subject=session_data.subject,
#         topic=session_data.topic,
#         start_time=datetime.utcnow(),
#         status="active"
#     )

#     db.add(new_session)
#     db.commit()
#     db.refresh(new_session)

#     return {
#         "message": "Session started",
#         "session_id": new_session.id
#     }

# @router.post("/end/{session_id}")
# def end_session(
#     session_id: int,
#     db: DBSession = Depends(get_db)
# ):

#     session = (
#         db.query(Session)
#         .filter(Session.id == session_id)
#         .first()
#     )

#     if not session:
#         return {
#             "error": "Session not found"
#         }

#     session.end_time = datetime.utcnow()

#     duration = (
#         session.end_time -
#         session.start_time
#     ).total_seconds()

#     session.duration = int(duration)

#     session.status = "completed"

#     db.commit()

#     return {
#         "message": "Session ended",
#         "session_id": session.id,
#         "duration_seconds": session.duration
#     }
# @router.get("/history")
# def get_session_history(
#     db: DBSession = Depends(get_db)
# ):

#     sessions = db.query(Session).all()

#     result = []

#     for session in sessions:
#         result.append({
#             "id": session.id,
#             "tutor_id": session.tutor_id,
#             "subject": session.subject,
#             "topic": session.topic,
#             "status": session.status,
#             "start_time": str(session.start_time),
#             "end_time": str(session.end_time)
#             if session.end_time else None
#         })

#     return result
# @router.get("/report/{session_id}")
# def session_report(
#     session_id: int,
#     db: DBSession = Depends(get_db)
# ):

#     session = (
#         db.query(Session)
#         .filter(Session.id == session_id)
#         .first()
#     )

#     transcripts = (
#         db.query(Transcript)
#         .filter(
#             Transcript.session_id == session_id
#         )
#         .all()
#     )

#     return {
#         "session": {
#             "id": session.id,
#             "subject": session.subject,
#             "topic": session.topic,
#             "status": session.status,
#             "start_time": str(session.start_time),
#             "end_time": str(session.end_time)
#             if session.end_time else None
#         },
#         "transcripts": [
#             {
#                 "speaker": t.speaker,
#                 "message": t.message
#             }
#             for t in transcripts
#         ]
#     }
# @router.get("/{session_id}")
# def get_session(
#     session_id: int,
#     db: DBSession = Depends(get_db)
# ):

#     session = (
#         db.query(Session)
#         .filter(Session.id == session_id)
#         .first()
#     )

#     return session

# @router.post("/save-transcript")
# def save_transcript(
#     data: TranscriptSaveRequest,
#     db: DBSession = Depends(get_db)
# ):

#    transcript = Transcript(
#     session_id=data.session_id,
#     speaker="Student",
#     message=data.transcript
#     )

#     db.add(transcript)
#     db.commit()
#     db.refresh(transcript)

#     return {
#         "message": "Transcript saved",
#         "transcript_id": transcript.id
#     }

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession
from datetime import datetime

from app.database import get_db
from app.models.session import Session
from app.models.transcript import Transcript

from app.schemas.session import SessionCreate
from app.schemas.transcript_save import TranscriptSaveRequest

router = APIRouter(
    prefix="/session",
    tags=["Session"]
)


# START SESSION
@router.post("/start")
def start_session(
    session_data: SessionCreate,
    db: DBSession = Depends(get_db)
):

    new_session = Session(
        tutor_id=1,
        subject=session_data.subject,
        topic=session_data.topic,
        start_time=datetime.utcnow(),
        status="active"
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return {
        "message": "Session started",
        "session_id": new_session.id
    }


# END SESSION
@router.post("/end/{session_id}")
def end_session(
    session_id: int,
    db: DBSession = Depends(get_db)
):

    session = (
        db.query(Session)
        .filter(Session.id == session_id)
        .first()
    )

    if not session:
        return {
            "error": "Session not found"
        }

    session.end_time = datetime.utcnow()

    duration = (
        session.end_time -
        session.start_time
    ).total_seconds()

    session.duration = int(duration)

    session.status = "completed"

    db.commit()

    return {
        "message": "Session ended",
        "session_id": session.id,
        "duration_seconds": session.duration
    }


# SESSION HISTORY
@router.get("/history")
def get_session_history(
    db: DBSession = Depends(get_db)
):

    sessions = db.query(Session).all()

    result = []

    for session in sessions:
        result.append({
            "id": session.id,
            "tutor_id": session.tutor_id,
            "subject": session.subject,
            "topic": session.topic,
            "status": session.status,
            "start_time": str(session.start_time),
            "end_time": str(session.end_time)
            if session.end_time else None
        })

    return result


# SESSION REPORT
@router.get("/report/{session_id}")
def session_report(
    session_id: int,
    db: DBSession = Depends(get_db)
):

    session = (
        db.query(Session)
        .filter(Session.id == session_id)
        .first()
    )

    if not session:
        return {
            "error": "Session not found"
        }

    transcripts = (
        db.query(Transcript)
        .filter(
            Transcript.session_id == session_id
        )
        .all()
    )

    return {
        "session": {
            "id": session.id,
            "subject": session.subject,
            "topic": session.topic,
            "status": session.status,
            "start_time": str(session.start_time),
            "end_time": str(session.end_time)
            if session.end_time else None
        },
        "transcripts": [
            {
                "speaker": t.speaker,
                "message": t.message
            }
            for t in transcripts
        ]
    }


# SAVE TRANSCRIPT
@router.post("/save-transcript")
def save_transcript(
    data: TranscriptSaveRequest,
    db: DBSession = Depends(get_db)
):

    transcript = Transcript(
        session_id=data.session_id,
        speaker="Student",
        message=data.transcript
    )

    db.add(transcript)
    db.commit()
    db.refresh(transcript)

    return {
        "message": "Transcript saved",
        "transcript_id": transcript.id
    }


# GET SINGLE SESSION
@router.get("/{session_id}")
def get_session(
    session_id: int,
    db: DBSession = Depends(get_db)
):

    session = (
        db.query(Session)
        .filter(Session.id == session_id)
        .first()
    )

    return session

@router.delete("/delete/{session_id}")
def delete_session(
    session_id: int,
    db: DBSession = Depends(get_db)
):
    # Delete transcripts first
    db.query(Transcript).filter(
        Transcript.session_id == session_id
    ).delete()

    # Delete session
    session = (
        db.query(Session)
        .filter(Session.id == session_id)
        .first()
    )

    if not session:
        return {
            "error": "Session not found"
        }

    db.delete(session)
    db.commit()

    return {
        "message": "Session deleted successfully"
    }