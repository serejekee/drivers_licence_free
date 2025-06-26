# How to Add Questions and Photos to Your Driving Test App

## 🚀 Your Application is Now Running!

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📂 Where to Put Your Photos

Place your photos in this directory:
```
frontend/public/images/questions/
```

### Example:
```bash
# Copy your photos to the backend static folder
cp /path/to/your/photos/* frontend/public/images/questions/
```

## 📝 How to Add Questions

### Method 1: CSV Upload (Recommended for Bulk Import)

1. **Create a CSV file** with this exact format:
```csv
question_text,answer_1,answer_2,answer_3,answer_4,right_answers,photo
"What is the speed limit in residential areas?","25 mph","35 mph","45 mph","55 mph","1","/static/images/questions/speed_limit.jpg"
"When should you use your turn signal?","Only when other cars are present","At least 100 feet before turning","Only on highways","Never","2",
"What does this traffic sign mean?","Stop completely","Proceed with caution","Yield to traffic","No entry","1","/static/images/questions/stop_sign.jpg"
```

2. **Upload via Admin Panel**:
   - Go to http://localhost:5173
   - Login with admin credentials
   - Navigate to Admin Panel → Questions tab
   - Use "Upload Questions from CSV" section
   - Select your CSV file and click Upload

### Method 2: Individual Question Entry

1. Go to Admin Panel → Questions tab
2. Click "Add New Question"
3. Fill in all fields:
   - Question Text
   - Answer 1, 2, 3, 4
   - Right Answers (1, 2, 3, or 4, or multiple like 1,3)
   - Photo: Either paste URL or upload image file

## 🔐 Admin Access

To create an admin user, you can:

1. **Register a new user** through the frontend
2. **Manually set admin privileges** in the database:
   ```sql
   UPDATE users SET is_admin = true WHERE username = 'your_username';
   ```

Or create an admin user directly in the database.

## 📸 Photo Guidelines

- **Supported formats**: JPG, PNG, GIF, WebP
- **Recommended size**: Keep images under 1MB for better performance
- **Naming**: Use descriptive names (e.g., `stop_sign.jpg`, `yield_sign.png`)

## 🎯 Right Answers Format

- Single correct answer: `"1"`, `"2"`, `"3"`, or `"4"`
- Multiple correct answers: `"1,3"`, `"2,4"`, etc.
- Letters also work: `"A"`, `"B,C"`, etc.

## 🔄 CSV Template

Use the template file `questions_template.csv` in the project root as a starting point.

## 🛠️ Troubleshooting

### If photos don't show up:
1. Check that photos are in the correct directory
2. Verify the photo path in CSV starts with `/static/images/questions/`
3. Restart the backend container: `docker-compose restart backend`

### If CSV upload fails:
1. Check CSV format (commas, quotes)
2. Ensure all required fields are filled
3. Check backend logs: `docker-compose logs backend`

## 🎨 Features Available

✅ **Black theme** throughout the application
✅ **Admin panel** for question management
✅ **CSV upload** for bulk question import
✅ **Image upload** for individual questions
✅ **Edit/Delete** questions
✅ **User management**
✅ **Training mode** with questions
✅ **Exam mode** for testing
✅ **View all questions** functionality

Your driving test application is now complete and ready to use! 🚗
