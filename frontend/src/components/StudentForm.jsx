import { useState } from "react";

const initialState = {
  rollNumber: "",
  course: "",
  marks: 0,
  attendance: 0,
  studyHours: 0,
  assignments: 0,
  previousMarks: 0
};

function StudentForm({ values, onSubmit, title = "Update Academic Inputs", submitLabel = "Save" }) {
  const [form, setForm] = useState(values || initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: ["rollNumber", "course"].includes(name) ? value : Number(value)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <section className="panel">
      <div className="card-heading">
        <h3>{title}</h3>
        <p className="muted">Update the factors used for performance analysis and prediction.</p>
      </div>
      <form className="student-form" onSubmit={handleSubmit}>
        <input name="rollNumber" value={form.rollNumber || ""} onChange={handleChange} placeholder="Roll Number" />
        <input name="course" value={form.course || ""} onChange={handleChange} placeholder="Course" />
        <input name="marks" type="number" value={form.marks} onChange={handleChange} placeholder="Current Marks" />
        <input name="attendance" type="number" value={form.attendance} onChange={handleChange} placeholder="Attendance %" />
        <input name="studyHours" type="number" step="0.1" value={form.studyHours} onChange={handleChange} placeholder="Study Hours" />
        <input name="assignments" type="number" value={form.assignments} onChange={handleChange} placeholder="Assignments %" />
        <input name="previousMarks" type="number" value={form.previousMarks} onChange={handleChange} placeholder="Previous Marks" />
        <button type="submit">{submitLabel}</button>
      </form>
    </section>
  );
}

export default StudentForm;
