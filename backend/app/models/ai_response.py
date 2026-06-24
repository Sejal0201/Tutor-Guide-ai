from sqlalchemy import Column, Integer, Text, ForeignKey

from app.database import Base

class AIResponse(Base):
    __tablename__ = "ai_responses"

    id = Column(Integer, primary_key=True)

    session_id = Column(
        Integer,
        ForeignKey("sessions.id")
    )

    response = Column(Text)