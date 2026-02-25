# 🚀 QUICK START - 3 Steps to Success

## Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install
```

This installs React, Vite, Bootstrap, and all required packages.
Takes 1-2 minutes. ⏳

## Step 2: Start Backend (Terminal 1)

```bash
python3 app.py
```

Expected output:
```
============================================================
🔄 INITIALIZING MONGODB ATLAS CONNECTION...
============================================================
✓ MongoDB Atlas connection SUCCESSFUL
✓ Sample data already exists (1 school(s))
============================================================

🚀 Starting Flask application on http://localhost:8000
```

✅ Backend running on `http://localhost:8000`

## Step 3: Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

✅ Frontend running on `http://localhost:3000`

## Step 4: Open Browser

```
http://localhost:3000
```

You should see the beautiful login page! 🎉

## Login

Choose one:

| Role | Email | Password |
|------|-------|----------|
| Teacher | teacher@school.com | teacher123 |
| Admin | admin@school.com | admin123 |
| Student | student@school.com | student123 |

## 🎯 What You'll See

### Teacher Login → Teacher Dashboard
- List of all students
- Class average marks
- Average attendance rate
- Pending assignments
- Action buttons to manage marks, attendance

### Admin Login → Admin Dashboard
- Total students count
- Total teachers count
- Total marks records
- Total attendance records
- Management buttons

### Student Login → Student Dashboard
- Your average marks
- Your attendance rate
- Total marks received
- Total assignments
- Links to view marks, attendance, assignments

## 🎨 UI Features

All pages have:
- **Beautiful gradient purple background** 💜
- **Smooth card-based layout** 📦
- **Responsive design** (works on mobile!)
- **Loading spinners** when fetching data
- **Error messages** if something fails
- **Professional colors** and animations

## ✅ Everything Should Work

- ✅ Login works
- ✅ Dashboard loads
- ✅ Navigation works
- ✅ Responsive on mobile
- ✅ No page reloads
- ✅ No errors in console

## 🐛 If Something Goes Wrong

### Port Already in Use?
```bash
# Kill Flask
lsof -ti:8000 | xargs kill -9

# Kill React
lsof -ti:3000 | xargs kill -9

# Then restart
```

### npm install fails?
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### MongoDB connection error?
Make sure MongoDB is running:
```bash
# Check MongoDB status
ps aux | grep mongod

# Or install and start:
brew install mongodb-community  # Mac
mongod
```

## 📚 Documentation

- **Quick Overview**: Read `README.md`
- **Detailed Setup**: Read `SETUP_GUIDE.md`
- **What's New**: Read `WHATS_NEW.md`
- **Frontend Docs**: Read `frontend/README.md`

## 🎉 Success Checklist

- [ ] `npm install` completed
- [ ] Flask running on port 8000
- [ ] React running on port 3000
- [ ] Browser opens to `http://localhost:3000`
- [ ] Can see login page
- [ ] Can login with credentials
- [ ] See dashboard after login
- [ ] No errors in console

If all checked ✓ - **You're done!** 🚀

## 💡 Pro Tips

1. Keep both terminals open while developing
2. React hot-reloads on file changes (no restart needed)
3. Flask logs show API calls in Terminal 1
4. Open browser console (F12) to see any errors
5. Try resizing browser window - UI is responsive!

## 🎓 Next Steps

Once everything is working:

1. Explore the Student/Teacher/Admin dashboards
2. Click around to see all features
3. Check the code structure in `frontend/src`
4. Read component files to understand React setup
5. Customize colors/styles in `frontend/src/App.css`

---

**That's it! You have a beautiful, modern, error-free Student Performance Analyzer!** 🎉

Any issues? Check the docs or create an issue report.
