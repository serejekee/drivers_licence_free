from sqlalchemy import Column, Integer, String
from ..db.session import Base


class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)
    answer_1 = Column(String, nullable=False)
    answer_2 = Column(String, nullable=False)
    answer_3 = Column(String, nullable=False)
    answer_4 = Column(String, nullable=False)
    right_answers = Column(String, nullable=False)
    photo = Column(String, nullable=True)
