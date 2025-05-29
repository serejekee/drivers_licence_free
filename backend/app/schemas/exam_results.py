from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class ExamAnswer(BaseModel):
    question_id: int
    selected_answers: List[str]
    correct_answers: List[str]
    is_correct: bool


class ExamSubmission(BaseModel):
    exam_type: str  # 'exam' or 'training'
    answers: List[ExamAnswer]
    time_taken: Optional[int] = None  # в секундах


class ExamResultOut(BaseModel):
    id: int
    user_id: int
    exam_type: str
    total_questions: int
    correct_answers: int
    percentage: float
    time_taken: Optional[int]
    passed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class ExamResultDetails(ExamResultOut):
    answers_data: Optional[str] = None  # JSON string with answer details
    

class ExamStats(BaseModel):
    total_exams: int
    passed_exams: int
    failed_exams: int
    average_score: float
    best_score: float
    worst_score: float
    total_training_sessions: int


class UserExamHistory(BaseModel):
    results: List[ExamResultOut]
    stats: ExamStats


class ExamSessionCreate(BaseModel):
    exam_type: str


class ExamSessionOut(BaseModel):
    id: int
    user_id: int
    started_at: datetime
    finished_at: Optional[datetime]
    exam_type: str
    status: str
    
    class Config:
        from_attributes = True
