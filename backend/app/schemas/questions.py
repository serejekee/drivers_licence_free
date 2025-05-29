from pydantic import BaseModel
from typing import List, Optional


class QuestionBase(BaseModel):
    question_text: str
    answer_1: str
    answer_2: str
    answer_3: str
    answer_4: str
    right_answers: str
    photo: Optional[str] = None


class QuestionCreate(QuestionBase):
    pass


class QuestionOut(QuestionBase):
    id: int

    class Config:
        from_attributes = True


class PaginatedQuestionsResponse(BaseModel):
    questions: List[QuestionOut]
    totalPages: int
