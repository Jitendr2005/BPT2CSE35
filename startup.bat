@echo off
color 0A
cls

echo ========================================
echo Student Performance Analyzer
echo Complete Startup Script
echo ========================================
echo.

REM Check if app.py exists
if not exist "app.py" (
    echo Error: app.py not found.
    echo Please run this script from the project root directory.
    exit /b 1
)

echo Cleaning up existing processes...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *Student*" 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak

echo.
echo Installing Python dependencies...
pip install -q -r requirements.txt 2>nul
echo Python packages installed!
echo.

echo Installing Node dependencies...
cd frontend
call npm install --silent 2>nul
cd ..
echo Node packages installed!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application, open TWO command prompts:
echo.
echo Command Prompt 1 (Backend Flask):
echo   python3 app.py
echo.
echo Command Prompt 2 (Frontend React):
echo   cd frontend
echo   npm run dev
echo.
echo Then open your browser to:
echo   http://localhost:3000
echo.
echo Demo Login:
echo   Teacher: teacher@school.com / teacher123
echo   Admin: admin@school.com / admin123
echo   Student: student@school.com / student123
echo.
echo ========================================
pause
