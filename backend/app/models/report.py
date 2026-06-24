from sqlalchemy import Column, Integer, Text, ForeignKey

from app.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)

    session_id = Column(
        Integer,
        ForeignKey("sessions.id")
    )

    content = Column(Text)