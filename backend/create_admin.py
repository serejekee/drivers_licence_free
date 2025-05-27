#!/usr/bin/env python3
"""
Script to create an admin user with username 'admin' and password 'admin'
"""

import os
import sys
import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Add the backend directory to the Python path
sys.path.append('/app')

from app.models.user import User
from app.db.session import get_db, engine

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_admin_user():
    """Create admin user with username 'admin' and password 'admin'"""

    # Create database session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # Check if admin user already exists
        existing_admin = db.query(User).filter(User.username == "admin").first()

        if existing_admin:
            print("❌ Admin user 'admin' already exists!")
            print(f"   User ID: {existing_admin.id}")
            print(f"   Email: {existing_admin.email}")
            print(f"   Is Admin: {existing_admin.is_admin}")
            print(f"   Is Active: {existing_admin.is_active}")
            return

        # Create admin user
        hashed_password = hash_password("admin")

        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=hashed_password,
            first_name="Admin",
            last_name="User",
            is_admin=True,
            is_active=True
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("✅ Admin user created successfully!")
        print(f"   Username: admin")
        print(f"   Password: admin")
        print(f"   Email: admin@example.com")
        print(f"   User ID: {admin_user.id}")
        print(f"   Is Admin: {admin_user.is_admin}")
        print()
        print("🚀 You can now login at: http://localhost:5173/login")
        print("📋 Access Admin Panel at: http://localhost:5173/admin")

    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_admin_user()
