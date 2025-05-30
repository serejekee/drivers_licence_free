from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.exam_results import ExamResult, ExamSession
from ..models.user import User
from ..schemas.exam_results import ExamSubmission
from sqlalchemy.sql import func
import json


def create_exam_result(db: Session, user: User, submission: ExamSubmission) -> ExamResult:
    total_questions = len(submission.answers)
    correct_answers = sum(1 for answer in submission.answers if answer.is_correct)
    percentage = (correct_answers / total_questions) * 100
    passed = percentage >= 70

    # JSON данные ответов
    answers_data = json.dumps([answer.dict() for answer in submission.answers])

    db_exam_result = ExamResult(
        user_id=user.id,
        exam_type=submission.exam_type,
        total_questions=total_questions,
        correct_answers=correct_answers,
        percentage=percentage,
        time_taken=submission.time_taken,
        passed=passed,
        answers_data=answers_data
    )
    db.add(db_exam_result)
    db.commit()
    db.refresh(db_exam_result)
    return db_exam_result


def get_exam_result(db: Session, result_id: int) -> Optional[ExamResult]:
    return db.query(ExamResult).filter(ExamResult.id == result_id).first()


def get_user_exam_history(db: Session, user: User) -> List[ExamResult]:
    return db.query(ExamResult).filter(ExamResult.user_id == user.id).order_by(ExamResult.created_at.desc()).all()


def get_exam_stats(db: Session, user: User) -> dict:
    total_exams = db.query(ExamResult).filter(ExamResult.user_id == user.id).count()
    passed_exams = db.query(ExamResult).filter(ExamResult.user_id == user.id, ExamResult.passed == True).count()
    failed_exams = total_exams - passed_exams
    
    average_score = db.query(func.avg(ExamResult.percentage)).filter(ExamResult.user_id == user.id).scalar() or 0
    best_score = db.query(func.max(ExamResult.percentage)).filter(ExamResult.user_id == user.id).scalar() or 0
    worst_score = db.query(func.min(ExamResult.percentage)).filter(ExamResult.user_id == user.id).scalar() or 0
    
    total_training_sessions = db.query(ExamResult).filter(ExamResult.user_id == user.id, ExamResult.exam_type == 'training').count()

    stats = {
        'total_exams': total_exams,
        'passed_exams': passed_exams,
        'failed_exams': failed_exams,
        'average_score': average_score,
        'best_score': best_score,
        'worst_score': worst_score,
        'total_training_sessions': total_training_sessions,
    }
    return stats


def create_exam_session(db: Session, user: User, exam_type: str) -> ExamSession:
    session = ExamSession(user_id=user.id, exam_type=exam_type)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def complete_exam_session(db: Session, session_id: int) -> Optional[ExamSession]:
    session = db.query(ExamSession).filter(ExamSession.id == session_id).first()
    if session:
        session.finished_at = func.now()
        session.status = 'completed'
        db.commit()
        db.refresh(session)
    return session
