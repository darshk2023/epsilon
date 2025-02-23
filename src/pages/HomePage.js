import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([
    { id: '1', number: 'CIS 1210', title: 'Data Structures & Algorithms' }
  ]);

  // For the popup (modal):
  const [showModal, setShowModal] = useState(false);
  const [newCourseNumber, setNewCourseNumber] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');

  // Open the popup:
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Close the popup (without adding a course):
  const handleCloseModal = () => {
    setShowModal(false);
    setNewCourseNumber('');
    setNewCourseTitle('');
  };

  // Add a new course:
  const handleAddCourse = () => {
    if (newCourseNumber.trim() && newCourseTitle.trim()) {
      const newCourse = {
        id: String(Date.now()),
        number: newCourseNumber,
        title: newCourseTitle
      };
      setCourses([...courses, newCourse]);
    }
    handleCloseModal(); // Close modal whether or not fields are valid
  };

  return (
    <div className="home-container">
      <h1>My Courses</h1>
      
      <div className="courses-grid">
        {/* Existing Courses */}
        {courses.map(course => (
          <div
            key={course.id}
            className="course-card"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <h3>{course.number}</h3>
            <p>{course.title}</p>
          </div>
        ))}

        {/* "Add Course" Card */}
        <div className="add-course-card" onClick={handleOpenModal}>
          <span className="plus-sign">+</span>
          <p>Add Course</p>
        </div>
      </div>

      {/* Popup (Modal) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add a New Course</h2>
            <input
              type="text"
              placeholder="Course Number"
              value={newCourseNumber}
              onChange={(e) => setNewCourseNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="Course Title"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={handleAddCourse}>Add</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;