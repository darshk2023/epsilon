import React, { useState } from 'react';

function ConceptQuizzes() {
  const [quizConcept, setQuizConcept] = useState('');

  const handleStartQuiz = () => {
    window.open(
      'https://elevenlabs.io/app/talk-to?agent_id=rYJKJ8fYqPUdQO54AXfo',
      '_blank'
    );
  };

  return (
    <div>
      <h3>Take a Quiz</h3>
      <input 
        type="text"
        placeholder="Enter the concept you'd like to be quizzed on..."
        value={quizConcept}
        onChange={e => setQuizConcept(e.target.value)}
      />
      <button onClick={handleStartQuiz}>Start Quiz</button>

      <div className="quiz-history">
        <h4>Quiz History</h4>
        <p>No quiz history yet</p>
      </div>
    </div>
  );
}

export default ConceptQuizzes;