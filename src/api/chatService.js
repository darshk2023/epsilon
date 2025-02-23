const API_BASE_URL = 'https://api.elevenlabs.io/v1/convai';

export async function fetchAllConversationsHistory(apiKey) {
  const url = `${API_BASE_URL}/conversations`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching conversation history: ${response.statusText}`);
  }
  
  return await response.json();
}

export async function fetchConversationDetails(conversationId, apiKey) {
  // Adjust the endpoint below to match the actual endpoint that returns details including the summary.
  const url = `${API_BASE_URL}/conversations/${conversationId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching details for ${conversationId}: ${response.statusText}`);
  }
  
  return await response.json();
}