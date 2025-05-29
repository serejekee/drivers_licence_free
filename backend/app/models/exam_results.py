from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db.session import Base


class ExamResult(Base):
    __tablename__ = "exam_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exam_type = Column(String, nullable=False)  # 'exam' or 'training'
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)
    time_taken = Column(Integer, nullable=True)  # в секундах
    passed = Column(Boolean, nullable=False)  # прошел ли экзамен (>= 70%)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Детали ответов в JSON
    answers_data = Column(Text, nullable=True)  # JSON строка с деталями ответов
    
    # Связь с пользователем
    user = relationship("User", back_populates="exam_results")


class ExamSession(Base):
    __tablename__ = "exam_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    exam_type = Column(String, nullable=False)
    status = Column(String, default="in_progress")  # 'in_progress', 'completed', 'abandoned'
    
    user = relationship("User")
