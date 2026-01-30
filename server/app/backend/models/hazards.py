from core.database import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String


class Hazards(Base):
    __tablename__ = "hazards"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    organization_id = Column(Integer, nullable=False)
    location_id = Column(Integer, nullable=True)
    category = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, nullable=False)
    gps_coordinates = Column(String, nullable=True)
    photo_urls = Column(String, nullable=True)
    voice_note_url = Column(String, nullable=True)
    is_anonymous = Column(Boolean, nullable=True)
    ai_suggested_category = Column(String, nullable=True)
    ai_suggested_severity = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)