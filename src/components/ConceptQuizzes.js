import React, { useState } from 'react';
import { IoHelpCircleOutline } from "react-icons/io5";

function ConceptQuizzes() {
  const [quizConcept, setQuizConcept] = useState('');

  const handleStartQuiz = () => {
    window.open(
      'https://elevenlabs.io/app/talk-to?agent_id=rYJKJ8fYqPUdQO54AXfo',
      '_blank'
    );
  };

  return (
    <div className="concept-quizzes-container">
      {/* Header */}
      <div className="concept-quizzes-label">
        <h2>Take a Quiz</h2>
      </div>

      {/* Input + Button row */}
      <div className="concept-quizzes-input-row">
        <input
          type="text"
          placeholder="Enter the concept you'd like to be quizzed on..."
          value={quizConcept}
          onChange={(e) => setQuizConcept(e.target.value)}
          className="concept-quizzes-input"
        />
        <button className="concept-quizzes-button" onClick={handleStartQuiz}>
          <IoHelpCircleOutline />
          <span>Start Quiz</span>
        </button>
      </div>

      {/* History section */}
      <div className="concept-quizzes-history-container">
        <h4 className="concept-quizzes-history-title">Quiz History</h4>
        <div className="concept-quizzes-history-box">
          <p>No quiz history yet</p>
        </div>
      </div>
    </div>
  );
}

export default ConceptQuizzes;