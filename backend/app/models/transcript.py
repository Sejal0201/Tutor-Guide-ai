from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(Integer, ForeignKey("sessions.id"))

    speaker = Column(String)
    message = Column(String)