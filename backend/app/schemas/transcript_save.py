from pydantic import BaseModel

class TranscriptSaveRequest(BaseModel):
    session_id: int
    transcript: str