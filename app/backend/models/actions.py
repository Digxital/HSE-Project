from core.database import Base
from sqlalchemy import Column, DateTime, Integer, String


class Actions(Base):
    __tablename__ = "actions"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    organization_id = Column(Integer, nullable=False)
    related_type = Column(String, nullable=True)
    related_id = Column(Integer, nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    owner_id = Column(String, nullable=True)
    owner_name = Column(String, nullable=True)
    status = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=True)
    completion_date = Column(DateTime(timezone=True), nullable=True)
    verification_status = Column(String, nullable=True)
    verification_notes = Column(String, nullable=True)
    evidence_urls = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)