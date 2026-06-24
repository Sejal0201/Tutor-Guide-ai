from pydantic import BaseModel

class SessionCreate(BaseModel):
    subject: str
    topic: str

class SessionResponse(BaseModel):
    id: int
    topic: str
    status: str