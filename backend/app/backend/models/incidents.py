from core.database import Base
from sqlalchemy import Column, DateTime, Integer, String


class Incidents(Base):
    __tablename__ = "incidents"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    organization_id = Column(Integer, nullable=False)
    location_id = Column(Integer, nullable=True)
    incident_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    description = Column(String, nullable=False)
    immediate_action = Column(String, nullable=True)
    investigation_summary = Column(String, nullable=True)
    status = Column(String, nullable=False)
    photo_urls = Column(String, nullable=True)
    ai_suggested_classification = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)