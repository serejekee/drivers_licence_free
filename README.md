# 🚀 Full Stack Application – Driver's License Portal

![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)
![Uvicorn](https://img.shields.io/badge/Uvicorn-0.24.0-blue)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0.23-ff69b4)
![Alembic](https://img.shields.io/badge/Alembic-1.12.1-informational)
![psycopg2-binary](https://img.shields.io/badge/psycopg2--binary-2.9.9-blueviolet)
![Pydantic](https://img.shields.io/badge/Pydantic-2.5.0-brightgreen)
![Python-JOSE](https://img.shields.io/badge/python--jose-3.3.0-yellow)
![Passlib](https://img.shields.io/badge/passlib-1.7.4-orange)
![Bcrypt](https://img.shields.io/badge/bcrypt-4.0.1-lightgrey)
![Multipart](https://img.shields.io/badge/python--multipart-0.0.6-critical)
![Pillow](https://img.shields.io/badge/Pillow-10.1.0-blue)
![Pytest](https://img.shields.io/badge/pytest-7.4.3-red)
![HTTPX](https://img.shields.io/badge/httpx-0.25.2-success)
![Dotenv](https://img.shields.io/badge/python--dotenv-1.0.0-important)
![Email Validator](https://img.shields.io/badge/email--validator-2.1.0-lightblue)

---

## ✨ Overview

A **modern full-stack web application** built with ❤️ for managing users, roles, items, and authentication. Features a responsive React frontend and a powerful FastAPI backend.

---

## 🔐 Features

- ✅ **Authentication & Authorization**
  - JWT-based system
  - Roles: `admin` & `user`
  - Secure login/logout/register flow

- 👤 **User Dashboard**
  - Edit profile
  - View orders, items, and history

- 🛠️ **Admin Panel**
  - Manage users and entities
  - View detailed dashboards

---

## 🧱 Tech Stack

| Layer     | Tech Used |
|-----------|-----------|
| Frontend  | `React + Vite`, `React Router`, `Redux Toolkit`, `TailwindCSS`, `Axios` |
| Backend   | `FastAPI`, `SQLAlchemy`, `Alembic`, `PostgreSQL`, `Pydantic`, `JWT` |
| DevOps    | `Docker`, `Docker-Compose`, `.env` configs |

---

## 🚀 Quickstart

### 1. 📦 Clone the Repository

```bash
git clone git@github.com:serejekee/fullstack_app_drivers_licence.git
cd fullstack-app
```

---

### 2. 🐳 Start with Docker

> Requires: Docker + Docker Compose installed

```bash
docker-compose up --build
```

---

### 3. ⚙️ Initialize Database

```bash
# Apply migrations
docker-compose exec backend alembic upgrade head

# Create admin user
docker-compose exec backend python create_admin.py
```

---

### 4. 🌐 Access App

| Part       | URL |
|------------|-----|
| Frontend   | http://localhost:5173 |
| API Docs   | http://localhost:8000/docs |
| Admin Login | http://localhost:5173/admin |

Default Admin Credentials:

```
👤 Username: admin
🔑 Password: admin
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` folder:

```
DATABASE_URL=postgresql://postgres:postgres@db:5432/drive
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DEBUG=True
```

---

## 🧪 Testing

Run tests for the backend:

```bash
cd backend
pytest
```

---

## 📸 Screenshots

<details>
<summary>🖼️ Click to expand</summary>

| User Dashboard | Admin Panel |
|----------------|-------------|
|![user](https://github.com/user-attachments/assets/439b150b-4ed5-4bec-8236-c8219b07710b)| ![admin](https://github.com/user-attachments/assets/7c4e59e8-8c02-4ec6-af09-f30ef25e7e6b) |

</details>

---

## 🪪 License

[MIT](LICENSE)

## 📸 How to Add Questions and Photos to Your Driving Test App

[IMPORT](Questions&Photos.md)

---


## 💡 Tip

> Use `.env.example` as a starting point for new environments or contributors.


## 📬 Contacts

[![Telegram Badge](https://img.shields.io/badge/Telegram-Contact-blue?style=flat&logo=telegram&logoColor=white)](https://t.me/spystars777)
[![Email Badge](https://img.shields.io/badge/Email-serejekee@inbox.ru-red?style=flat&logo=gmail&logoColor=white)](mailto:serejekee@inbox.ru)
[![KakaoTalk](https://img.shields.io/badge/KakaoTalk-serejekee-yellow?style=flat&logo=kakaotalk&logoColor=000000)](https://open.kakao.com/o/serejekee)
