import React from 'react';

function OfficeHours() {
  const handleStartChat = () => {
    window.open(
      'https://elevenlabs.io/app/talk-to?agent_id=B3AodyDXBnjCcoreuY9C',
      '_blank'
    );
  };

  return (
    <div>
      <h3>Start a Conversation</h3>
      <button onClick={handleStartChat}>Start Office Hours Chat</button>

      <div className="conversation-history">
        <h4>Conversation History</h4>
        <p>No conversation history yet</p>
      </div>
    </div>
  );
}

export default OfficeHours;