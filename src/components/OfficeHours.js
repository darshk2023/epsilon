import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllConversationsHistory, fetchConversationDetails } from '../api/chatService';
import { IoChatbubbleOutline } from "react-icons/io5";

function OfficeHours() {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);
  const apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;

  // Fetch the list of conversations, then for each conversation fetch its details.
  const getHistory = useCallback(async () => {
    try {
      const listData = await fetchAllConversationsHistory(apiKey);
      if (listData && listData.conversations) {
        const conversationsList = listData.conversations;
        const detailedConversations = await Promise.all(
          conversationsList.map(async (conv) => {
            try {
              const details = await fetchConversationDetails(conv.conversation_id, apiKey);
              const transcriptSummary =
                details.analysis && details.analysis.transcript_summary
                  ? details.analysis.transcript_summary
                  : null;
              const timestamp = details.start_time_unix_secs || conv.start_time_unix_secs;
              return {
                ...conv,
                transcriptSummary,
                timestamp,
              };
            } catch (detailError) {
              console.error(`Failed to fetch details for ${conv.conversation_id}`, detailError);
              return conv;
            }
          })
        );
        setConversations(detailedConversations);
      } else {
        setError('No conversations found.');
      }
    } catch (err) {
      setError(err.message);
    }
  }, [apiKey]);

  useEffect(() => {
    getHistory();
    const intervalId = setInterval(getHistory, 10000); // poll every 10 seconds
    return () => clearInterval(intervalId);
  }, [getHistory]);

  // Opens the chat window for office hours.
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
      {/* <div className="office-hours-history-container">
        <h4 className="office-hours-history-title">Conversation History</h4>
        <div className="office-hours-history-box">
          <p>No conversation history yet</p>
        </div>
      </div> */}
      <h4>Conversation History</h4>
      <div className="conversation-history">
        {error && <p className="error">Error: {error}</p>}
        {conversations.length === 0 && !error ? (
          <p>No conversation history yet</p>
        ) : (
          conversations.map((conversation, index) => {
            // Calculate bottom-up numbering: if there are N conversations, the first displayed gets number N - index.
            const convNumber = conversations.length - index;
            const lastTimestamp = conversation.timestamp
              ? new Date(conversation.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Unknown time';
            return (
              <div key={conversation.conversation_id} className="conversation">
                <h5 className="conversation-title">Conversation #{convNumber}</h5>
                <span className="timestamp">Started at: {lastTimestamp}</span>
                {conversation.transcriptSummary ? (
                  <div className="transcript-summary">
                    <strong>Transcript Summary:</strong>
                    <pre>{conversation.transcriptSummary}</pre>
                  </div>
                ) : (
                  <p>No transcript summary available for this conversation</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default OfficeHours;