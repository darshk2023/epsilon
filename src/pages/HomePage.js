import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  // Example of storing courses in local state
  const [courses, setCourses] = useState([
    { id: '1', number: 'CIS 1210', title: 'Data Structures & Algorithms' }
  ]);

  const [courseNumber, setCourseNumber] = useState('');
  const [courseTitle, setCourseTitle] = useState('');

  const handleAddCourse = () => {
    if (courseNumber.trim() && courseTitle.trim()) {
      const newCourse = {
        id: String(Date.now()), // quick unique ID
        number: courseNumber,
        title: courseTitle
      };
      setCourses([...courses, newCourse]);
      setCourseNumber('');
      setCourseTitle('');
    }
  };

  return (
    <div className="home-container">
      <h1>My Courses</h1>
      
      <div className="courses-grid">
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
        <div className="add-course-card">
          <h2>Add Course</h2>
          <input
            type="text"
            placeholder="Course Number"
            value={courseNumber}
            onChange={e => setCourseNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Course Title"
            value={courseTitle}
            onChange={e => setCourseTitle(e.target.value)}
          />
          <button onClick={handleAddCourse}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;