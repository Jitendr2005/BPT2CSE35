#!/bin/bash

echo "========================================"
echo "Student Performance Analyzer"
echo "Complete Startup Script"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: app.py not found. Please run this script from the project root directory."
    exit 1
fi

echo "🔧 Setting up Student Performance Analyzer..."
echo ""

# Kill any existing processes on ports 8000 and 3000
echo "🧹 Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2

echo ""
echo "✅ Processes cleaned up"
echo ""

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -q -r requirements.txt 2>/dev/null
echo "✅ Python dependencies installed"
echo ""

# Install Node dependencies for frontend
echo "📦 Installing Node dependencies..."
cd frontend
npm install --silent 2>/dev/null
echo "✅ Node dependencies installed"
cd ..
echo ""

echo "========================================"
echo "✨ Setup Complete!"
echo "========================================"
echo ""
echo "To start the application, open TWO terminal windows:"
echo ""
echo "Terminal 1 (Backend Flask):"
echo "  $ python3 app.py"
echo ""
echo "Terminal 2 (Frontend React):"
echo "  $ cd frontend"
echo "  $ npm run dev"
echo ""
echo "Then open your browser to:"
echo "  🌐 http://localhost:3000"
echo ""
echo "Demo Login:"
echo "  Teacher: teacher@school.com / teacher123"
echo "  Admin: admin@school.com / admin123"
echo "  Student: student@school.com / student123"
echo ""
echo "========================================"
