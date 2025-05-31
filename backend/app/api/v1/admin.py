from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import csv
import io
import os
import uuid
import shutil
from pathlib import Path
from ...db.session import get_db
from ...schemas.user import User, UserUpdate, UserCreate
from ...schemas.questions import QuestionOut, QuestionCreate
from ...crud.user import get_users, get_user, update_user, delete_user, create_user
from ...crud.questions import create_question, delete_question, update_question, delete_all_questions, count_all_questions, get_questions_paginated
from ...services.auth import get_current_admin_user

router = APIRouter()


# User Management
@router.get("/users", response_model=List[User])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
               _: User = Depends(get_current_admin_user)):
    return get_users(db, skip=skip, limit=limit)


@router.post("/users", response_model=User)
def create_new_user(user: UserCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin_user)):
    return create_user(db, user)


@router.put("/users/{user_id}", response_model=User)
def modify_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db),
                _: User = Depends(get_current_admin_user)):
    db_user = get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return update_user(db, db_user=db_user, user_update=user_update)


@router.delete("/users/{user_id}", response_model=bool)
def remove_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin_user)):
    return delete_user(db, user_id=user_id)


# Question Management
@router.get("/questions")
def list_questions(page: int = 1, limit: int = 10, db: Session = Depends(get_db),
                   _: User = Depends(get_current_admin_user)):
    from ...schemas.questions import PaginatedQuestionsResponse
    total_questions = count_all_questions(db)
    total_pages = (total_questions + limit - 1) // limit
    questions = get_questions_paginated(db, page=page, limit=limit)
    return {
        "questions": [QuestionOut.from_orm(q) for q in questions],
        "totalPages": total_pages,
        "currentPage": page,
        "totalQuestions": total_questions,
        "questionsPerPage": limit
    }


@router.post("/questions", response_model=QuestionOut)
def add_question(question: QuestionCreate, db: Session = Depends(get_db),
                 _: User = Depends(get_current_admin_user)):
    return create_question(db, question=question)


@router.put("/questions/{question_id}", response_model=QuestionOut)
def modify_question(question_id: int, question_update: QuestionCreate, db: Session = Depends(get_db),
                    _: User = Depends(get_current_admin_user)):
    updated_question = update_question(db, question_id=question_id, question_update=question_update)
    if not updated_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return updated_question


@router.delete("/questions/{question_id}", response_model=bool)
def remove_question(question_id: int, db: Session = Depends(get_db),
                    _: User = Depends(get_current_admin_user)):
    return delete_question(db, question_id=question_id)


@router.delete("/questions/all/delete")
def remove_all_questions(db: Session = Depends(get_db),
                        _: User = Depends(get_current_admin_user)):
    """Delete all questions from the database"""
    deleted_count = delete_all_questions(db)
    return {
        "message": f"Successfully deleted {deleted_count} questions",
        "deleted_count": deleted_count
    }


# CSV Import for Questions
@router.post("/questions/import-csv")
async def import_questions_csv(file: UploadFile = File(...), db: Session = Depends(get_db),
                               _: User = Depends(get_current_admin_user)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV file")

    try:
        content = await file.read()
        content_str = content.decode('utf-8-sig')  # Handle BOM if present
        # Use semicolon as delimiter to match your CSV format
        csv_reader = csv.DictReader(io.StringIO(content_str), delimiter=';')

        imported_count = 0
        errors = []

        for row_num, row in enumerate(csv_reader, start=2):  # Start from 2 because row 1 is headers
            try:
                # Map your CSV columns to expected format:
                # "question";"answer_1";"answer_2";"answer_3";"answer_4";"right_answer";"photo"
                question_data = {
                    "question_text": row.get("question", "").strip(),
                    "answer_1": row.get("answer_1", "").strip(),
                    "answer_2": row.get("answer_2", "").strip(),
                    "answer_3": row.get("answer_3", "").strip(),
                    "answer_4": row.get("answer_4", "").strip(),
                    "right_answers": row.get("right_answer", "").strip(),
                    "photo": row.get("photo", "").strip() or None
                }

                # Validate required fields
                required_fields = ["question_text", "answer_1", "answer_2", "answer_3", "answer_4", "right_answers"]
                missing_fields = [field for field in required_fields if not question_data[field]]

                if missing_fields:
                    errors.append(f"Row {row_num}: Missing required fields: {', '.join(missing_fields)}")
                    continue

                question = QuestionCreate(**question_data)
                create_question(db, question=question)
                imported_count += 1

            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
                continue

        return {
            "message": f"Successfully imported {imported_count} questions",
            "imported_count": imported_count,
            "errors": errors
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV file: {str(e)}")


# Image Upload for Questions
@router.post("/questions/upload-image")
async def upload_question_image(file: UploadFile = File(...),
                                _: User = Depends(get_current_admin_user)):
    # Check if the file is an image
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"

        # Create upload directory if it doesn't exist
        upload_dir = Path("static/images/questions")
        upload_dir.mkdir(parents=True, exist_ok=True)

        # Save the file
        file_path = upload_dir / unique_filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Return the relative path that can be used in frontend
        relative_path = f"/static/images/questions/{unique_filename}"

        return {
            "message": "Image uploaded successfully",
            "filename": unique_filename,
            "path": relative_path
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")
