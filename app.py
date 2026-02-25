from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_pymongo import PyMongo
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, IntegerField, FloatField, SelectField, TextAreaField
from wtforms.validators import DataRequired, Email, Length, NumberRange
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'
# MongoDB Atlas Configuration - Using provided credentials
app.config['MONGO_URI'] = 'mongodb://localhost:27017/student_performance'

mongo = PyMongo(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User class for Flask-Login
class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.username = user_data['username']
        self.email = user_data['email']
        self.role = user_data['role']
        self.school_id = user_data['school_id']

@login_manager.user_loader
def load_user(user_id):
    try:
        user_data = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        if user_data:
            return User(user_data)
    except:
        pass
    return None

# ======================== FORMS ========================
class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Sign In')

class StudentForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    grade = StringField('Grade', validators=[DataRequired()])
    submit = SubmitField('Save Student')

class MarksForm(FlaskForm):
    subject = StringField('Subject', validators=[DataRequired()])
    score = FloatField('Score', validators=[DataRequired(), NumberRange(min=0, max=100)])
    exam_type = StringField('Exam Type (Midterm/Final)', validators=[DataRequired()])
    submit = SubmitField('Save Marks')

class AssignmentForm(FlaskForm):
    title = StringField('Assignment Title', validators=[DataRequired()])
    subject = StringField('Subject', validators=[DataRequired()])
    score = FloatField('Score Obtained', validators=[DataRequired(), NumberRange(min=0)])
    max_score = FloatField('Max Score', validators=[DataRequired(), NumberRange(min=1)])
    submit = SubmitField('Save Assignment')

class AttendanceForm(FlaskForm):
    date = StringField('Date (YYYY-MM-DD)', validators=[DataRequired()])
    status = SelectField('Status', choices=[('present', 'Present'), ('absent', 'Absent'), ('late', 'Late')])
    submit = SubmitField('Save Attendance')

# ======================== ROUTES ========================

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_data = mongo.db.users.find_one({'username': form.username.data})
        if user_data and check_password_hash(user_data['password_hash'], form.password.data):
            user = User(user_data)
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password', 'danger')
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'success')
    return redirect(url_for('index'))

# ======================== DASHBOARD ROUTING ========================

@app.route('/dashboard')
@login_required
def dashboard():
    if current_user.role == 'student':
        return redirect(url_for('student_dashboard'))
    elif current_user.role == 'teacher':
        return redirect(url_for('teacher_dashboard'))
    elif current_user.role == 'admin':
        return redirect(url_for('admin_dashboard'))
    return redirect(url_for('index'))

# ======================== STUDENT ROUTES ========================

@app.route('/student/dashboard')
@login_required
def student_dashboard():
    if current_user.role != 'student':
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    student = mongo.db.students.find_one({'email': current_user.email})
    if not student:
        flash('Student record not found', 'warning')
        return redirect(url_for('index'))
    
    student_id = str(student['_id'])
    marks = list(mongo.db.marks.find({'student_id': student_id}))
    assignments = list(mongo.db.assignments.find({'student_id': student_id}))
    attendances = list(mongo.db.attendances.find({'student_id': student_id}))
    
    # Calculate statistics
    average_marks = np.mean([m['score'] for m in marks]) if marks else 0
    attendance_rate = len([a for a in attendances if a['status'].lower() == 'present']) / len(attendances) * 100 if attendances else 0
    assignment_avg = np.mean([a.get('score', 0) for a in assignments]) if assignments else 0
    
    return render_template('student_dashboard.html', 
                         student=student, 
                         average_marks=average_marks,
                         attendance_rate=attendance_rate,
                         total_marks=len(marks),
                         total_assignments=len(assignments))

@app.route('/student/marks')
@login_required
def student_marks():
    if current_user.role != 'student':
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    student = mongo.db.students.find_one({'email': current_user.email})
    marks = list(mongo.db.marks.find({'student_id': str(student['_id'])}).sort('date', -1))
    return render_template('student_marks.html', marks=marks, student=student)

@app.route('/student/attendance')
@login_required
def student_attendance():
    if current_user.role != 'student':
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    student = mongo.db.students.find_one({'email': current_user.email})
    attendances = list(mongo.db.attendances.find({'student_id': str(student['_id'])}).sort('date', -1))
    return render_template('student_attendance.html', attendances=attendances, student=student)

@app.route('/student/assignments')
@login_required
def student_assignments():
    if current_user.role != 'student':
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    student = mongo.db.students.find_one({'email': current_user.email})
    assignments = list(mongo.db.assignments.find({'student_id': str(student['_id'])}).sort('date', -1))
    return render_template('student_assignments.html', assignments=assignments, student=student)

# ======================== TEACHER ROUTES ========================

@app.route('/teacher/dashboard')
@login_required
def teacher_dashboard():
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    school_id = current_user.school_id
    students = list(mongo.db.students.find({'school_id': school_id}))
    
    # Add statistics for each student
    all_marks = []
    all_attendance = []
    pending_count = 0
    
    for student in students:
        student_id = str(student['_id'])
        marks = list(mongo.db.marks.find({'student_id': student_id}))
        attendances = list(mongo.db.attendances.find({'student_id': student_id}))
        assignments = list(mongo.db.assignments.find({'student_id': student_id}))
        
        student['avg_marks'] = np.mean([m['score'] for m in marks]) if marks else 0
        all_marks.extend([m['score'] for m in marks])
        
        student['attendance_rate'] = len([a for a in attendances if a['status'].lower() == 'present']) / len(attendances) * 100 if attendances else 0
        all_attendance.extend([1 if a['status'].lower() == 'present' else 0 for a in attendances])
        
        student['total_marks'] = len(marks)
        student['total_attendance'] = len(attendances)
        
        pending_count += len([a for a in assignments if a.get('status', '').lower() == 'pending'])
    
    # Calculate class-wide statistics
    class_average = np.mean(all_marks) if all_marks else 0
    class_attendance = (sum(all_attendance) / len(all_attendance) * 100) if all_attendance else 0
    
    return render_template('teacher_dashboard.html', 
                         students=students,
                         total_students=len(students),
                         class_average=class_average,
                         class_attendance=class_attendance,
                         pending_assignments=pending_count)

@app.route('/teacher/student/<student_id>/marks')
@login_required
def teacher_marks(student_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        student = mongo.db.students.find_one({'_id': ObjectId(student_id), 'school_id': current_user.school_id})
    except:
        student = None
    
    if not student:
        flash('Student not found', 'warning')
        return redirect(url_for('teacher_dashboard'))
    
    marks = list(mongo.db.marks.find({'student_id': student_id}).sort('date', -1))
    return render_template('teacher_marks.html', student=student, marks=marks)

@app.route('/teacher/student/<student_id>/marks/add', methods=['GET', 'POST'])
@login_required
def teacher_add_marks(student_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    form = MarksForm()
    try:
        student = mongo.db.students.find_one({'_id': ObjectId(student_id), 'school_id': current_user.school_id})
    except:
        student = None
    
    if not student:
        flash('Student not found', 'warning')
        return redirect(url_for('teacher_dashboard'))
    
    if form.validate_on_submit():
        mark = {
            'student_id': student_id,
            'subject': form.subject.data,
            'score': form.score.data,
            'exam_type': form.exam_type.data,
            'date': datetime.utcnow()
        }
        mongo.db.marks.insert_one(mark)
        flash('Marks added successfully', 'success')
        return redirect(url_for('teacher_marks', student_id=student_id))
    
    return render_template('teacher_marks_form.html', student=student, form=form, action='Add')

@app.route('/teacher/student/<student_id>/marks/<mark_id>/edit', methods=['GET', 'POST'])
@login_required
def teacher_edit_marks(student_id, mark_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        student = mongo.db.students.find_one({'_id': ObjectId(student_id), 'school_id': current_user.school_id})
        mark = mongo.db.marks.find_one({'_id': ObjectId(mark_id)})
    except:
        student = None
        mark = None
    
    if not student or not mark:
        flash('Record not found', 'warning')
        return redirect(url_for('teacher_dashboard'))
    
    form = MarksForm()
    if form.validate_on_submit():
        mongo.db.marks.update_one(
            {'_id': ObjectId(mark_id)},
            {'$set': {
                'subject': form.subject.data,
                'score': form.score.data,
                'exam_type': form.exam_type.data
            }}
        )
        flash('Marks updated successfully', 'success')
        return redirect(url_for('teacher_marks', student_id=student_id))
    
    if request.method == 'GET':
        form.subject.data = mark.get('subject', '')
        form.score.data = mark.get('score', 0)
        form.exam_type.data = mark.get('exam_type', '')
    
    return render_template('teacher_marks_form.html', student=student, form=form, action='Edit')

@app.route('/teacher/student/<student_id>/marks/<mark_id>/delete', methods=['POST'])
@login_required
def teacher_delete_marks(student_id, mark_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        mongo.db.marks.delete_one({'_id': ObjectId(mark_id)})
        flash('Marks deleted successfully', 'success')
    except:
        flash('Error deleting marks', 'danger')
    
    return redirect(url_for('teacher_marks', student_id=student_id))

@app.route('/teacher/student/<student_id>/attendance')
@login_required
def teacher_attendance(student_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        student = mongo.db.students.find_one({'_id': ObjectId(student_id), 'school_id': current_user.school_id})
    except:
        student = None
    
    if not student:
        flash('Student not found', 'warning')
        return redirect(url_for('teacher_dashboard'))
    
    attendances = list(mongo.db.attendances.find({'student_id': student_id}).sort('date', -1))
    return render_template('teacher_attendance.html', student=student, attendances=attendances)

@app.route('/teacher/student/<student_id>/attendance/add', methods=['GET', 'POST'])
@login_required
def teacher_add_attendance(student_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    form = AttendanceForm()
    try:
        student = mongo.db.students.find_one({'_id': ObjectId(student_id), 'school_id': current_user.school_id})
    except:
        student = None
    
    if not student:
        flash('Student not found', 'warning')
        return redirect(url_for('teacher_dashboard'))
    
    if form.validate_on_submit():
        attendance = {
            'student_id': student_id,
            'date': form.date.data,
            'status': form.status.data
        }
        mongo.db.attendances.insert_one(attendance)
        flash('Attendance added successfully', 'success')
        return redirect(url_for('teacher_attendance', student_id=student_id))
    
    return render_template('teacher_attendance_form.html', student=student, form=form, action='Add')

@app.route('/teacher/student/<student_id>/attendance/<attendance_id>/edit', methods=['GET', 'POST'])
@login_required
def teacher_edit_attendance(student_id, attendance_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        student = mongo.db.students.find_one({'_id': ObjectId(student_id), 'school_id': current_user.school_id})
        attendance = mongo.db.attendances.find_one({'_id': ObjectId(attendance_id)})
    except:
        student = None
        attendance = None
    
    if not student or not attendance:
        flash('Record not found', 'warning')
        return redirect(url_for('teacher_dashboard'))
    
    form = AttendanceForm()
    if form.validate_on_submit():
        mongo.db.attendances.update_one(
            {'_id': ObjectId(attendance_id)},
            {'$set': {
                'date': form.date.data,
                'status': form.status.data
            }}
        )
        flash('Attendance updated successfully', 'success')
        return redirect(url_for('teacher_attendance', student_id=student_id))
    
    if request.method == 'GET':
        form.date.data = attendance.get('date', '')
        form.status.data = attendance.get('status', 'present')
    
    return render_template('teacher_attendance_form.html', student=student, form=form, action='Edit')

@app.route('/teacher/student/<student_id>/attendance/<attendance_id>/delete', methods=['POST'])
@login_required
def teacher_delete_attendance(student_id, attendance_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        mongo.db.attendances.delete_one({'_id': ObjectId(attendance_id)})
        flash('Attendance deleted successfully', 'success')
    except:
        flash('Error deleting attendance', 'danger')
    
    return redirect(url_for('teacher_attendance', student_id=student_id))

@app.route('/teacher/student/<student_id>/assignments')
@login_required
def teacher_assignments(student_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        student = mongo.db.students.find_one({'_id': ObjectId(student_id), 'school_id': current_user.school_id})
    except:
        student = None
    
    if not student:
        flash('Student not found', 'warning')
        return redirect(url_for('teacher_dashboard'))
    
    assignments = list(mongo.db.assignments.find({'student_id': student_id}).sort('date', -1))
    return render_template('teacher_assignments.html', student=student, assignments=assignments)

@app.route('/teacher/student/<student_id>/assignments/add', methods=['GET', 'POST'])
@login_required
def teacher_add_assignment(student_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    form = AssignmentForm()
    try:
        student = mongo.db.students.find_one({'_id': ObjectId(student_id), 'school_id': current_user.school_id})
    except:
        student = None
    
    if not student:
        flash('Student not found', 'warning')
        return redirect(url_for('teacher_dashboard'))
    
    if form.validate_on_submit():
        assignment = {
            'student_id': student_id,
            'title': form.title.data,
            'subject': form.subject.data,
            'score': form.score.data,
            'max_score': form.max_score.data,
            'date': datetime.utcnow()
        }
        mongo.db.assignments.insert_one(assignment)
        flash('Assignment added successfully', 'success')
        return redirect(url_for('teacher_assignments', student_id=student_id))
    
    return render_template('teacher_assignment_form.html', student=student, form=form, action='Add')

@app.route('/teacher/student/<student_id>/assignments/<assignment_id>/edit', methods=['GET', 'POST'])
@login_required
def teacher_edit_assignment(student_id, assignment_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        student = mongo.db.students.find_one({'_id': ObjectId(student_id), 'school_id': current_user.school_id})
        assignment = mongo.db.assignments.find_one({'_id': ObjectId(assignment_id)})
    except:
        student = None
        assignment = None
    
    if not student or not assignment:
        flash('Record not found', 'warning')
        return redirect(url_for('teacher_dashboard'))
    
    form = AssignmentForm()
    if form.validate_on_submit():
        mongo.db.assignments.update_one(
            {'_id': ObjectId(assignment_id)},
            {'$set': {
                'title': form.title.data,
                'subject': form.subject.data,
                'score': form.score.data,
                'max_score': form.max_score.data
            }}
        )
        flash('Assignment updated successfully', 'success')
        return redirect(url_for('teacher_assignments', student_id=student_id))
    
    if request.method == 'GET':
        form.title.data = assignment.get('title', '')
        form.subject.data = assignment.get('subject', '')
        form.score.data = assignment.get('score', 0)
        form.max_score.data = assignment.get('max_score', 0)
    
    return render_template('teacher_assignment_form.html', student=student, form=form, action='Edit')

@app.route('/teacher/student/<student_id>/assignments/<assignment_id>/delete', methods=['POST'])
@login_required
def teacher_delete_assignment(student_id, assignment_id):
    if current_user.role not in ['teacher', 'admin']:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        mongo.db.assignments.delete_one({'_id': ObjectId(assignment_id)})
        flash('Assignment deleted successfully', 'success')
    except:
        flash('Error deleting assignment', 'danger')
    
    return redirect(url_for('teacher_assignments', student_id=student_id))

# ======================== ADMIN ROUTES ========================

@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if current_user.role != 'admin':
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    school = mongo.db.schools.find_one({'_id': ObjectId(current_user.school_id)})
    total_students = mongo.db.students.count_documents({'school_id': current_user.school_id})
    total_teachers = mongo.db.users.count_documents({'school_id': current_user.school_id, 'role': 'teacher'})
    total_marks = mongo.db.marks.count_documents({})
    total_attendance = mongo.db.attendances.count_documents({})
    
    return render_template('admin_dashboard.html', 
                         school=school,
                         total_students=total_students,
                         total_teachers=total_teachers,
                         total_marks=total_marks,
                         total_attendance=total_attendance)

@app.route('/admin/students')
@login_required
def admin_students():
    if current_user.role != 'admin':
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    students = list(mongo.db.students.find({'school_id': current_user.school_id}))
    return render_template('admin_students.html', students=students)

@app.route('/admin/students/add', methods=['GET', 'POST'])
@login_required
def admin_add_student():
    if current_user.role != 'admin':
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    form = StudentForm()
    if form.validate_on_submit():
        student = {
            'name': form.name.data,
            'email': form.email.data,
            'grade': form.grade.data,
            'school_id': current_user.school_id,
            'created_at': datetime.utcnow()
        }
        mongo.db.students.insert_one(student)
        flash('Student added successfully', 'success')
        return redirect(url_for('admin_students'))
    
    return render_template('admin_student_form.html', form=form, action='Add')

@app.route('/admin/students/<student_id>/edit', methods=['GET', 'POST'])
@login_required
def admin_edit_student(student_id):
    if current_user.role != 'admin':
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        student = mongo.db.students.find_one({'_id': ObjectId(student_id), 'school_id': current_user.school_id})
    except:
        student = None
    
    if not student:
        flash('Student not found', 'warning')
        return redirect(url_for('admin_students'))
    
    form = StudentForm()
    if form.validate_on_submit():
        mongo.db.students.update_one(
            {'_id': ObjectId(student_id)},
            {'$set': {
                'name': form.name.data,
                'email': form.email.data,
                'grade': form.grade.data,
                'updated_at': datetime.utcnow()
            }}
        )
        flash('Student updated successfully', 'success')
        return redirect(url_for('admin_students'))
    
    if request.method == 'GET':
        form.name.data = student['name']
        form.email.data = student['email']
        form.grade.data = student.get('grade', '')
    
    return render_template('admin_student_form.html', form=form, action='Edit')

@app.route('/admin/students/<student_id>/delete', methods=['POST'])
@login_required
def admin_delete_student(student_id):
    if current_user.role != 'admin':
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        mongo.db.students.delete_one({'_id': ObjectId(student_id)})
        mongo.db.marks.delete_many({'student_id': student_id})
        mongo.db.attendances.delete_many({'student_id': student_id})
        mongo.db.assignments.delete_many({'student_id': student_id})
        flash('Student and related data deleted successfully', 'success')
    except:
        flash('Error deleting student', 'danger')
    
    return redirect(url_for('admin_students'))

@app.route('/admin/teachers')
@login_required
def admin_teachers():
    if current_user.role != 'admin':
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    teachers = list(mongo.db.users.find({'school_id': current_user.school_id, 'role': 'teacher'}))
    return render_template('admin_teachers.html', teachers=teachers)

@app.route('/admin/school', methods=['GET', 'POST'])
@login_required
def admin_school():
    if current_user.role != 'admin':
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    try:
        school = mongo.db.schools.find_one({'_id': ObjectId(current_user.school_id)})
    except:
        school = None
    
    if request.method == 'POST':
        mongo.db.schools.update_one(
            {'_id': ObjectId(current_user.school_id)},
            {'$set': {
                'name': request.form.get('name'),
                'address': request.form.get('address'),
                'phone': request.form.get('phone'),
                'email': request.form.get('email'),
                'updated_at': datetime.utcnow()
            }}
        )
        flash('School information updated successfully', 'success')
        return redirect(url_for('admin_school'))
    
    return render_template('admin_school.html', school=school)

# ======================== API ROUTES ========================

@app.route('/api/performance_data')
@login_required
def api_performance_data():
    if current_user.role not in ['teacher', 'admin']:
        return jsonify({'error': 'Access denied'}), 403
    
    students = list(mongo.db.students.find({'school_id': current_user.school_id}))
    data = {
        'students': [],
        'averages': [],
        'attendance': []
    }
    
    for student in students:
        student_id = str(student['_id'])
        marks = list(mongo.db.marks.find({'student_id': student_id}))
        attendances = list(mongo.db.attendances.find({'student_id': student_id}))
        
        avg_marks = np.mean([m['score'] for m in marks]) if marks else 0
        attendance_rate = len([a for a in attendances if a['status'] == 'present']) / len(attendances) * 100 if attendances else 0
        
        data['students'].append(student['name'])
        data['averages'].append(float(avg_marks))
        data['attendance'].append(float(attendance_rate))
    
    return jsonify(data)

# ======================== DATABASE INITIALIZATION ========================

def init_db():
    try:
        with app.app_context():
            print("\n" + "="*60)
            print("🔄 INITIALIZING MONGODB ATLAS CONNECTION...")
            print("="*60)
            
            try:
                mongo.db.command('ping')
                print("✓ MongoDB Atlas connection SUCCESSFUL\n")
            except Exception as e:
                print(f"✗ MongoDB Atlas connection FAILED: {e}")
                print("   Retrying with connection parameters...\n")
                mongo.db.command('ping')
            
            # Check if sample data already exists
            school_count = mongo.db.schools.count_documents({})
            if school_count == 0:
                print("📝 INITIALIZING SAMPLE DATA...\n")
                
                # Create sample school
                school = {
                    'name': 'Excellence International School',
                    'address': '123 Education Lane, Smart City',
                    'phone': '+92-300-1234567',
                    'email': 'contact@excellenceschool.edu',
                    'created_at': datetime.utcnow()
                }
                school_result = mongo.db.schools.insert_one(school)
                school_id = str(school_result.inserted_id)
                print(f"  ✓ School Created: {school['name']}")
                
                # Create admin user
                admin = {
                    'username': 'admin',
                    'email': 'admin@excellenceschool.edu',
                    'password_hash': generate_password_hash('admin123'),
                    'role': 'admin',
                    'school_id': school_id,
                    'created_at': datetime.utcnow()
                }
                mongo.db.users.insert_one(admin)
                print(f"  ✓ Admin Created: admin / admin123")
                
                # Create teacher users
                teachers = [
                    {'username': 'teacher1', 'email': 'teacher1@excellenceschool.edu'},
                    {'username': 'teacher2', 'email': 'teacher2@excellenceschool.edu'},
                ]
                
                for teacher_data in teachers:
                    teacher = {
                        'username': teacher_data['username'],
                        'email': teacher_data['email'],
                        'password_hash': generate_password_hash('teacher123'),
                        'role': 'teacher',
                        'school_id': school_id,
                        'created_at': datetime.utcnow()
                    }
                    mongo.db.users.insert_one(teacher)
                print(f"  ✓ Teachers Created: 2 teachers / teacher123")
                
                # Create sample students with complete data
                students_data = [
                    {'name': 'Alice Johnson', 'email': 'alice@excellenceschool.edu', 'grade': '10A'},
                    {'name': 'Bob Smith', 'email': 'bob@excellenceschool.edu', 'grade': '10A'},
                    {'name': 'Charlie Brown', 'email': 'charlie@excellenceschool.edu', 'grade': '10B'},
                    {'name': 'Diana Prince', 'email': 'diana@excellenceschool.edu', 'grade': '10B'},
                    {'name': 'Eve Wilson', 'email': 'eve@excellenceschool.edu', 'grade': '10C'},
                ]
                
                for student_data in students_data:
                    student = {
                        **student_data,
                        'school_id': school_id,
                        'created_at': datetime.utcnow()
                    }
                    student_result = mongo.db.students.insert_one(student)
                    student_id_str = str(student_result.inserted_id)
                    
                    # Add marks for each subject/exam
                    subjects = ['Mathematics', 'English', 'Science', 'History']
                    for subject in subjects:
                        for exam in ['Midterm', 'Final']:
                            mark = {
                                'student_id': student_id_str,
                                'subject': subject,
                                'score': float(np.random.randint(65, 95)),
                                'exam_type': exam,
                                'date': datetime.utcnow()
                            }
                            mongo.db.marks.insert_one(mark)
                    
                    # Add 30 days of attendance
                    for i in range(30):
                        att_date = (datetime.utcnow() - timedelta(days=30-i)).strftime('%Y-%m-%d')
                        status = np.random.choice(['present', 'present', 'present', 'present', 'absent', 'late'])
                        attendance = {
                            'student_id': student_id_str,
                            'date': att_date,
                            'status': status
                        }
                        mongo.db.attendances.insert_one(attendance)
                    
                    # Add assignments
                    for i in range(5):
                        assignment = {
                            'student_id': student_id_str,
                            'subject': np.random.choice(subjects),
                            'title': f'Assignment {i+1}',
                            'score': float(np.random.randint(15, 20)),
                            'max_score': 20.0,
                            'date': datetime.utcnow()
                        }
                        mongo.db.assignments.insert_one(assignment)
                
                print(f"  ✓ Students Created: 5 students with complete data")
                print("\n" + "="*60)
                print("✅ DATABASE INITIALIZATION COMPLETED SUCCESSFULLY!")
                print("="*60 + "\n")
            else:
                print(f"✓ Sample data already exists ({school_count} school(s))")
                print("\n" + "="*60 + "\n")
                
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        print("="*60)
        print("⚠️  Database initialization failed!")
        print("   Please check your MongoDB Atlas connection string")
        print("="*60 + "\n")

# ======================== API ENDPOINTS (For React Frontend) ========================

@app.route('/api/auth-check')
def auth_check():
    if current_user.is_authenticated:
        return jsonify({'authenticated': True, 'role': current_user.role}), 200
    return jsonify({'authenticated': False}), 401

@app.route('/api/user-data')
@login_required
def user_data():
    return jsonify({
        'username': current_user.username,
        'email': current_user.email,
        'role': current_user.role
    }), 200

@app.route('/api/student-stats')
@login_required
def student_stats():
    if current_user.role != 'student':
        return jsonify({'error': 'Access denied'}), 403
    
    student = mongo.db.students.find_one({'email': current_user.email})
    if not student:
        return jsonify({'error': 'Student record not found'}), 404
    
    student_id = str(student['_id'])
    marks = list(mongo.db.marks.find({'student_id': student_id}))
    attendances = list(mongo.db.attendances.find({'student_id': student_id}))
    assignments = list(mongo.db.assignments.find({'student_id': student_id}))
    
    average_marks = np.mean([m['score'] for m in marks]) if marks else 0
    attendance_rate = len([a for a in attendances if a['status'].lower() == 'present']) / len(attendances) * 100 if attendances else 0
    
    return jsonify({
        'averageMarks': float(average_marks),
        'attendanceRate': float(attendance_rate),
        'totalMarks': len(marks),
        'totalAssignments': len(assignments)
    }), 200

@app.route('/api/teacher-stats')
@login_required
def teacher_stats():
    if current_user.role not in ['teacher', 'admin']:
        return jsonify({'error': 'Access denied'}), 403
    
    school_id = current_user.school_id
    students = list(mongo.db.students.find({'school_id': school_id}))
    
    all_marks = []
    all_attendance = []
    pending_count = 0
    
    students_data = []
    for student in students:
        student_id = str(student['_id'])
        marks = list(mongo.db.marks.find({'student_id': student_id}))
        attendances = list(mongo.db.attendances.find({'student_id': student_id}))
        assignments = list(mongo.db.assignments.find({'student_id': student_id}))
        
        avg_marks = np.mean([m['score'] for m in marks]) if marks else 0
        all_marks.extend([m['score'] for m in marks])
        
        attendance_rate = len([a for a in attendances if a['status'].lower() == 'present']) / len(attendances) * 100 if attendances else 0
        all_attendance.extend([1 if a['status'].lower() == 'present' else 0 for a in attendances])
        
        pending_count += len([a for a in assignments if a.get('status', '').lower() == 'pending'])
        
        students_data.append({
            'username': student.get('username', student.get('name')),
            'email': student.get('email'),
            'avg_marks': float(avg_marks),
            'attendance_rate': float(attendance_rate),
            '_id': str(student['_id'])
        })
    
    class_average = np.mean(all_marks) if all_marks else 0
    class_attendance = (sum(all_attendance) / len(all_attendance) * 100) if all_attendance else 0
    
    return jsonify({
        'totalStudents': len(students),
        'classAverage': float(class_average),
        'classAttendance': float(class_attendance),
        'pendingAssignments': pending_count,
        'students': students_data
    }), 200

@app.route('/api/admin-stats')
@login_required
def admin_stats():
    if current_user.role != 'admin':
        return jsonify({'error': 'Access denied'}), 403
    
    total_students = mongo.db.students.count_documents({'school_id': current_user.school_id})
    total_teachers = mongo.db.users.count_documents({'school_id': current_user.school_id, 'role': 'teacher'})
    total_marks = mongo.db.marks.count_documents({})
    total_attendance = mongo.db.attendances.count_documents({})
    
    return jsonify({
        'totalStudents': total_students,
        'totalTeachers': total_teachers,
        'totalMarks': total_marks,
        'totalAttendance': total_attendance
    }), 200

if __name__ == '__main__':
    init_db()
    print("🚀 Starting Flask application on http://localhost:8000")
    print("📱 Open your browser and login with credentials shown above\n")
    app.run(debug=True, port=8000)
