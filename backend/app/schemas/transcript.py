from pydantic import BaseModel


# class TranscriptMessage(BaseModel):
#     role: str
#     message: str

  
class TranscriptCreate(BaseModel):
    session_id: int
    speaker: str
    message: str