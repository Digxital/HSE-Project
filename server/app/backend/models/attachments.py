from core.database import Base
from sqlalchemy import Column, DateTime, Integer, String


class Attachments(Base):
    __tablename__ = "attachments"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    related_type = Column(String, nullable=False)
    related_id = Column(Integer, nullable=False)
    file_type = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    file_name = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)