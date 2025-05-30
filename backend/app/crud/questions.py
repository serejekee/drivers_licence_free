from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from ..models.questions import Question
from ..schemas import questions as schemas


def get_question_by_number(db: Session, number: int) -> Optional[Question]:
    return db.query(Question).offset(number - 1).limit(1).first()


def get_multiple_questions(db: Session, limit: int = 40) -> List[Question]:
    return db.query(Question).order_by(func.random()).limit(limit).all()


def count_all_questions(db: Session) -> int:
    return db.query(Question).count()


def get_questions_paginated(db: Session, page: int, limit: int) -> List[Question]:
    return db.query(Question).offset((page - 1) * limit).limit(limit).all()


def create_question(db: Session, question: schemas.QuestionCreate) -> Question:
    db_question = Question(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


def get_all_questions(db: Session) -> List[Question]:
    return db.query(Question).all()


def delete_question(db: Session, question_id: int) -> bool:
    question = db.query(Question).filter(Question.id == question_id).first()
    if question:
        db.delete(question)
        db.commit()
        return True
    return False


def update_question(db: Session, question_id: int, question_update: schemas.QuestionCreate) -> Optional[Question]:
    question = db.query(Question).filter(Question.id == question_id).first()
    if question:
        for key, value in question_update.dict().items():
            setattr(question, key, value)
        db.commit()
        db.refresh(question)
        return question
    return None


def delete_all_questions(db: Session) -> int:
    """Delete all questions from the database and return the count of deleted questions"""
    count = db.query(Question).count()
    db.query(Question).delete()
    db.commit()
    return count

