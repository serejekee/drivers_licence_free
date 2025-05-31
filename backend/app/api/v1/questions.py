from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Union
from ...db.session import get_db
from ...crud import questions as crud
from ...schemas import questions as schemas

router = APIRouter()


@router.get(
    "/",
    response_model=Union[List[schemas.QuestionOut], schemas.QuestionOut, schemas.PaginatedQuestionsResponse]
)
def get_questions(
        number: int = Query(None),
        mode: str = Query("exam"),
        page: int = Query(1, ge=1),
        limit: int = Query(40, ge=1),
        db: Session = Depends(get_db)
):
    if mode == "training":
        questions = crud.get_multiple_questions(db, limit=limit)
        if not questions:
            raise HTTPException(status_code=404, detail="Questions not found")
        return [schemas.QuestionOut.from_orm(q) for q in questions]

    elif mode == "all-questions":
        total_questions = crud.count_all_questions(db)
        total_pages = (total_questions + limit - 1) // limit
        questions = crud.get_questions_paginated(db, page=page, limit=limit)
        if not questions:
            raise HTTPException(status_code=404, detail="Questions not found")
        return schemas.PaginatedQuestionsResponse(
            questions=[schemas.QuestionOut.from_orm(q) for q in questions],
            totalPages=total_pages
        )

    else:
        if number is None:
            raise HTTPException(status_code=400, detail="Parameter 'number' is required")
        question = crud.get_question_by_number(db, number)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        return schemas.QuestionOut.from_orm(question)

