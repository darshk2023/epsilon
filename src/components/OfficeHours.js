import React from 'react';
import { IoChatbubbleOutline } from "react-icons/io5";

function OfficeHours() {
  const handleStartChat = () => {
    window.open(
      'https://elevenlabs.io/app/talk-to?agent_id=qfVjfr9T0R59w3aG6jsI',
      '_blank'
    );
  };

  return (
    <div className="office-hours-container">
      {/* Header */}
      <div className="office-hours-label">
        <h2>Start a Conversation</h2>
      </div>

      {/* Input + Button row */}
      <div className="office-hours-input-row">
        <input
          type="text"
          placeholder="Enter your question or topic..."
          className="office-hours-input"
        />
        <button className="office-hours-button" onClick={handleStartChat}>
          <IoChatbubbleOutline />
          <span>Start Office Hours Chat</span>
        </button>
      </div>

      {/* History section */}
      <div className="office-hours-history-container">
        <h4 className="office-hours-history-title">Conversation History</h4>
        <div className="office-hours-history-box">
          <p>No conversation history yet</p>
        </div>
      </div>
    </div>
  );
}

export default OfficeHours;