import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllConversationsHistory, fetchConversationDetails } from '../api/chatService';
import { IoHelpCircleOutline } from "react-icons/io5";

function ConceptQuizzes() {
  // State for quiz history (concept quizzes) and for a planned quiz (derived from office hours)
  const [quizHistory, setQuizHistory] = useState([]);
  const [plannedQuiz, setPlannedQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [quizConcept, setQuizConcept] = useState('');
  
  const apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;
  
  // Agent IDs (replace with your actual IDs)
  const quizAgentId = 'rYJKJ8fYqPUdQO54AXfo';         // For concept quizzes
  const officeHoursAgentId = 'qfVjfr9T0R59w3aG6jsI';    // For office hours

  // Fetch concept quiz history (conversations by quizAgentId)
  const getQuizHistory = useCallback(async () => {
    try {
      const listData = await fetchAllConversationsHistory(apiKey);
      if (listData && listData.conversations) {
        // Filter to include only conversations from the quiz agent
        const quizConversations = listData.conversations.filter(
          conv => conv.agent_id === quizAgentId
        );
        const detailedQuizzes = await Promise.all(
          quizConversations.map(async (conv) => {
            try {
              const details = await fetchConversationDetails(conv.conversation_id, apiKey);
              const transcriptSummary =
                details.analysis && details.analysis.transcript_summary
                  ? details.analysis.transcript_summary
                  : null;
              const timestamp = details.start_time_unix_secs || conv.start_time_unix_secs;
              return { ...conv, transcriptSummary, timestamp };
            } catch (detailError) {
              console.error(`Failed to fetch details for ${conv.conversation_id}`, detailError);
              return conv;
            }
          })
        );
        setQuizHistory(detailedQuizzes);
      } else {
        setError('No quiz conversations found.');
      }
    } catch (err) {
      setError(err.message);
    }
  }, [apiKey, quizAgentId]);

  // Fetch the latest Office Hours conversation that includes the special ratio data
  const getPlannedQuiz = useCallback(async () => {
    try {
      const listData = await fetchAllConversationsHistory(apiKey);
      if (listData && listData.conversations) {
        // Filter for Office Hours conversations
        const ohConversations = listData.conversations.filter(
          conv => conv.agent_id === officeHoursAgentId
        );
        const detailedOH = await Promise.all(
          ohConversations.map(async (conv) => {
            try {
              const details = await fetchConversationDetails(conv.conversation_id, apiKey);
              const analysis = details.analysis || null;
              // Check for the ratio data in analysis.data_collection_results.
              const ratioResult = analysis &&
                analysis.data_collection_results &&
                analysis.data_collection_results["Topics Taught to Understanding Ratio"]
                ? analysis.data_collection_results["Topics Taught to Understanding Ratio"]
                : null;
              const transcriptSummary =
                analysis && analysis.transcript_summary
                  ? analysis.transcript_summary
                  : null;
              const timestamp = details.start_time_unix_secs || conv.start_time_unix_secs;
              return { ...conv, analysis, ratioResult, transcriptSummary, timestamp };
            } catch (detailError) {
              console.error(`Failed to fetch Office Hours details for ${conv.conversation_id}`, detailError);
              return conv;
            }
          })
        );
        // Pick the most recent conversation that has valid ratio data.
        const planned = detailedOH
          .filter(conv => conv.ratioResult && conv.ratioResult.value)
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0];
        setPlannedQuiz(planned || null);
      } else {
        setPlannedQuiz(null);
      }
    } catch (err) {
      console.error(err);
      setPlannedQuiz(null);
    }
  }, [apiKey, officeHoursAgentId]);

  // Set up polling for both quiz history and planned quiz.
  useEffect(() => {
    getQuizHistory();
    const quizIntervalId = setInterval(getQuizHistory, 10000);
    return () => clearInterval(quizIntervalId);
  }, [getQuizHistory]);

  useEffect(() => {
    getPlannedQuiz();
    const plannedIntervalId = setInterval(getPlannedQuiz, 10000);
    return () => clearInterval(plannedIntervalId);
  }, [getPlannedQuiz]);

  // Clear planned quiz if a concept quiz is completed.
  // Here we assume that if quizHistory is non-empty (i.e. a quiz was held), we remove the planned quiz.
  useEffect(() => {
    if (quizHistory.length > 0) {
      setPlannedQuiz(null);
    }
  }, [quizHistory]);

  const handleStartQuiz = () => {
    const baseUrl = 'https://elevenlabs.io/app/talk-to';
    const url = new URL(baseUrl);
    url.searchParams.set('agent_id', quizAgentId);
    if (quizConcept) {
      url.searchParams.set('concept', quizConcept);
    }
    window.open(url.toString(), '_blank');
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

      {/* Render the planned quiz (if one exists) above all completed quizzes */}
      {plannedQuiz && (
        <div className="planned-quiz">
          <h4 className="quiz-title">Planned Quiz</h4>
          <p>
            <strong>Topics Taught (rated 1-5):</strong> {plannedQuiz.analysis.data_collection_results["Topics Taught to Understanding Ratio"].value}
          </p>
          {plannedQuiz.transcriptSummary && (
            <div className="transcript-summary">
              <strong>Transcript Summary:</strong>
              <pre>{plannedQuiz.transcriptSummary}</pre>
            </div>
          )}
        </div>
      )}

      {/* History section */}
      {/* <div className="concept-quizzes-history-container">
        <h4 className="concept-quizzes-history-title">Quiz History</h4>
        <div className="concept-quizzes-history-box">
          <p>No quiz history yet</p>
        </div>
      </div> */}

      <h4>Quiz History</h4>
      <div className="quiz-history">        
        {error && <p className="error">Error: {error}</p>}
        {quizHistory.length === 0 && !error ? (
          <p>No quiz history yet</p>
        ) : (
          quizHistory.map((quiz, index) => {
            const lastTimestamp = quiz.timestamp
              ? new Date(quiz.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Unknown time';
            // Numbering from bottom up
            const quizNumber = quizHistory.length - index;
            return (
              <div key={quiz.conversation_id} className="quiz">
                <h5 className="quiz-title">Quiz #{quizNumber}</h5>
                <span className="timestamp">Started at: {lastTimestamp}</span>
                {quiz.transcriptSummary ? (
                  <div className="transcript-summary">
                    <strong>Transcript Summary:</strong>
                    <pre>{quiz.transcriptSummary}</pre>
                  </div>
                ) : (
                  <p>No transcript summary available for this quiz</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ConceptQuizzes;