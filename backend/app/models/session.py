from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

from app.database import Base


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)

    tutor_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    subject = Column(String)
    topic = Column(String)

    start_time = Column(DateTime)
    end_time = Column(DateTime)

    duration = Column(Integer, nullable=True)

    status = Column(
        String,
        default="active"
    )