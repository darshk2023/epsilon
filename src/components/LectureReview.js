import React, { useState } from 'react';

function LectureReview() {
  const [concept, setConcept] = useState('');

  const handleStartReview = () => {
    // TODO: Implement the review functionality
    console.log('Starting review for:', concept);
  };

  return (
    <div>
      <h3>Review a Concept</h3>
      <input 
        type="text"
        placeholder="Enter the concept you'd like to review..."
        value={concept}
        onChange={e => setConcept(e.target.value)}
      />
      <button onClick={handleStartReview}>Start Review</button>

      <div className="review-history">
        <h4>Review History</h4>
        <p>No review history yet</p>
      </div>
    </div>
  );
}

export default LectureReview;