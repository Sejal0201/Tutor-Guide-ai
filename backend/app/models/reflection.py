from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Reflection(Base):
    __tablename__ = "reflections"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("sessions.id")
    )

    summary = Column(String)
    strengths = Column(String)
    improvements = Column(String)
    score = Column(Integer)