function StudentsTable({ students, onEdit }) {
  return (
    <section className="panel">
      <div className="card-heading">
        <h3>Student Directory</h3>
        <p className="muted">Review live student data and select a record to update.</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Marks</th>
              <th>Attendance</th>
              <th>Predicted</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.student?.name}</td>
                <td>{student.course}</td>
                <td>{student.marks}</td>
                <td>{student.attendance}%</td>
                <td>{student.predictedScore}</td>
                <td>
                  <span className={`badge ${student.performanceCategory.toLowerCase()}`}>
                    {student.performanceCategory}
                  </span>
                </td>
                <td>
                  <button className="mini-button" onClick={() => onEdit(student)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default StudentsTable;
