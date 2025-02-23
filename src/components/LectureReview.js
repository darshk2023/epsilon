import React, { useState } from 'react';
import { IoVideocamOutline } from "react-icons/io5";

function LectureReview() {
  const [concept, setConcept] = useState('');

  const handleStartReview = () => {
    // TODO: Implement the review functionality
    console.log('Starting review for:', concept);
  };

  return (
    <div className="lecture-review-container">
      {/* "Review a Concept" label */}
      <div className="review-label"><h2>Review a Concept</h2></div>

      {/* Input + Button row */}
      <div className="review-input-row">
        <input
          type="text"
          placeholder="Enter the concept you'd like to review..."
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          className="review-input"
        />
        <button className="review-button" onClick={handleStartReview}>
          <IoVideocamOutline /> <span>Start Review</span>
        </button>
      </div>

      {/* Review History section */}
      <div className="review-history-container">
        <h4 className="review-history-title">History</h4>
        <div className="review-history-box">
          <p>No review history yet</p>
        </div>
      </div>
    </div>
  );
}

export default LectureReview;