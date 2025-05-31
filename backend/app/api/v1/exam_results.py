from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...db.session import get_db
from ...schemas.exam_results import ExamSubmission, ExamResultOut, ExamStats, UserExamHistory, ExamSessionCreate, ExamSessionOut
from ...crud import exam_results as crud
from ...services.auth import get_current_user
from ...models.user import User

router = APIRouter()


@router.post("/submit", response_model=ExamResultOut)
def submit_exam_result(
    submission: ExamSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отправка результатов экзамена или тренировки"""
    try:
        result = crud.create_exam_result(db, current_user, submission)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error saving exam result: {str(e)}")


@router.get("/history", response_model=UserExamHistory)
def get_user_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение истории экзаменов пользователя"""
    results = crud.get_user_exam_history(db, current_user)
    stats = crud.get_exam_stats(db, current_user)
    
    return UserExamHistory(
        results=results,
        stats=ExamStats(**stats)
    )


@router.get("/stats", response_model=ExamStats)
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение статистики пользователя"""
    stats = crud.get_exam_stats(db, current_user)
    return ExamStats(**stats)


@router.get("/results/{result_id}", response_model=ExamResultOut)
def get_exam_result(
    result_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение конкретного результата экзамена"""
    result = crud.get_exam_result(db, result_id)
    if not result:
        raise HTTPException(status_code=404, detail="Exam result not found")
    
    # Проверяем, что результат принадлежит текущему пользователю
    if result.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return result


@router.post("/sessions", response_model=ExamSessionOut)
def create_session(
    session_data: ExamSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создание новой сессии экзамена"""
    session = crud.create_exam_session(db, current_user, session_data.exam_type)
    return session


@router.put("/sessions/{session_id}/complete", response_model=ExamSessionOut)
def complete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Завершение сессии экзамена"""
    session = crud.complete_exam_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return session
