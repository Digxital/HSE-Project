from core.database import Base
from sqlalchemy import Column, DateTime, Integer, String


class Organizations(Base):
    __tablename__ = "organizations"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    industry = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)