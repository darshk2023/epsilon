import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LectureReview from '../components/LectureReview';
import OfficeHours from '../components/OfficeHours';
import ConceptQuizzes from '../components/ConceptQuizzes';

function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you'd fetch the course by `id`.
  // For simplicity, let's store some dummy course data here:
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // Just a mock fetch or find from local storage, etc.
    // Hardcode for demonstration:
    setCourse({
      id,
      number: 'CIS 1210',
      title: 'Data Structures & Algorithms'
    });
  }, [id]);

  const [activeTab, setActiveTab] = useState('lecture'); // 'lecture', 'office', 'quizzes'

  if (!course) {
    return <div>Loading course...</div>;
  }

  return (
    <div className="course-page">
      <button className="back-button" onClick={() => navigate('/')}>
        &larr; Back to Courses
      </button>
      <div className="course-info">
        <h2>{course.number}</h2>
        <p>- {course.title}</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={activeTab === 'lecture' ? 'active' : ''} 
          id="lecture-tab"
          onClick={() => setActiveTab('lecture')}
        >
          Lecture Review
        </button>
        <button 
          className={activeTab === 'office' ? 'active' : ''} 
          id="office-tab"
          onClick={() => setActiveTab('office')}
        >
          On-Demand Office Hours
        </button>
        <button 
          className={activeTab === 'quizzes' ? 'active' : ''} 
          id="quizzes-tab"
          onClick={() => setActiveTab('quizzes')}
        >
          Concept Quizzes
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'lecture' && <LectureReview />}
        {activeTab === 'office' && <OfficeHours />}
        {activeTab === 'quizzes' && <ConceptQuizzes />}
      </div>
    </div>
  );
}

export default CoursePage;