import React, { useState } from 'react';
import { IoVideocamOutline } from "react-icons/io5";
import OpenAI from 'openai';
import axios from 'axios';
import { fal } from '@fal-ai/client';

// Helper function that calls the Python endpoint for PDF parsing.
async function fetchPDFText(pdfUrl) {
  const response = await fetch('http://localhost:5000/api/parse_pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Pass the PDF URL. For example, if your PDF is served from your React public folder,
    // you might use the fully qualified URL like "http://localhost:3000/knowledge.pdf".
    body: JSON.stringify({ url: 'http://localhost:3000/knowledge.pdf' }),
  });
  const json = await response.json();
  if (json.error) {
    throw new Error(json.error);
  }
  return json.text;
}

// Helper function to process PDFs and create embeddings.
async function processPDFsAndCreateEmbeddings(openai) {
  // Get the PDF text from the Python backend.
  const pdfText = await fetchPDFText('http://localhost:3000/knowledge.pdf');
  
  // Generate an embedding for the entire PDF text using OpenAI.
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: pdfText,
  });
  const embeddingVector = response.data.data[0].embedding;
  // Return an array of objects with both the embedding and the corresponding text.
  return [{ embedding: embeddingVector, text: pdfText }];
}

function LectureReview() {
  const [concept, setConcept] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');

  // For display in the UI (you may update this as needed)
  const localVideoUrl = '/quicksort.mov';

  const handleStartReview = async () => {
    setLoading(true);
    try {
      // Configure OpenAI with your API key from your environment variables.
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      });

      // Process the PDF and build the knowledge base (embeddings and text) using the Python parser.
      const knowledgeBase = await processPDFsAndCreateEmbeddings(openai);
      console.log('Knowledge Base:', knowledgeBase);

      // Generate an embedding for the user's concept.
      const conceptEmbeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: concept,
      });
      const conceptEmbedding = conceptEmbeddingResponse.data.data[0].embedding;

      // Retrieve the most relevant knowledge base chunk via cosine similarity.
      let bestMatch = null;
      let bestSimilarity = -1;
      for (const chunk of knowledgeBase) {
        const sim = chunk.embedding.reduce((sum, a, i) => sum + a * conceptEmbedding[i], 0);
        if (sim > bestSimilarity) {
          bestSimilarity = sim;
          bestMatch = chunk;
        }
      }
      const retrievedContext = bestMatch ? bestMatch.text : '';
      console.log('Retrieved Context Similarity:', bestSimilarity);

      // Create a prompt that now includes the relevant context.
      const prompt = `You are an AI Teaching Assistant for CIS 1210. You have access to the following relevant lecture notes:\n\n${retrievedContext}\n\nYour goal is to create a 1 minute lecture review about ${concept}, using clear, natural language and intuitive explanations.`;

      // Generate the lecture review text using Chat Completion.
      const completionResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful teaching assistant.' },
          { role: 'user', content: prompt },
        ],
      });
      const lectureReviewText = completionResponse.choices[0].message?.content || '';

      // Convert the lecture review text to speech using ElevenLabs TTS API.
      const voiceId = 'UgBBYS2sOqTuMpoF3BR0';
      const modelId = 'eleven_multilingual_v2';
      const ttsResponse = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text: lectureReviewText,
          model_id: modelId,
        },
        {
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          responseType: 'arraybuffer',
        }
      );
      // Convert the audio response to a blob URL.
      const lectureAudioBlob = new Blob([ttsResponse.data], { type: 'audio/mpeg' });
      const lectureAudioDataUri = URL.createObjectURL(lectureAudioBlob);
      console.log("Lecture review audio converted to Data URI");

      // Merge assets using FAL's lip sync API.
      const baseVideoDataUri = '/base_video.mov'; // Adjust this as needed.
      
      fal.config({ credentials: process.env.FAL_KEY });
      console.log("Submitting lipsync request to FAL...");
      const lipsyncResult = await fal.subscribe("fal-ai/sync-lipsync", {
        input: {
          video_url: baseVideoDataUri,
          audio_url: lectureAudioDataUri,
          sync_mode: "cut_off"
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.forEach((log) => console.log(log.message));
          }
        },
      });

      console.log("Lipsynced video generated:", lipsyncResult.data);
      const lipsyncVideoUrl = lipsyncResult.data.video.url;
      setGeneratedVideoUrl(lipsyncVideoUrl);
      console.log("Lipsynced video ready for display:", lipsyncVideoUrl);

    } catch (error) {
      console.error('Error in handleStartReview:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lecture-review-container">
      <div className="review-label">
        <h2>Review a Concept</h2>
      </div>

      <div className="review-input-row">
        <input
          type="text"
          placeholder="Enter the concept you'd like to review..."
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          className="review-input"
        />
        <button className="review-button" onClick={handleStartReview} disabled={loading}>
          <IoVideocamOutline /> <span>{loading ? "Processing..." : "Start Review"}</span>
        </button>
      </div>

      {/* Display the generated lecture review video when available */}
      {generatedVideoUrl && (
        <div className="generated-video-container" style={{ marginTop: '20px' }}>
          <h4>Generated Lecture Review Video</h4>
          <video src={generatedVideoUrl} controls style={{ width: '100%', borderRadius: '4px' }} />
          <a className="download-link" href={generatedVideoUrl} download>Download</a>
        </div>
      )}

      <div className="review-history-container">
        <h4 className="review-history-title">Video History</h4>
        <div className="video-grid">
          <div className="video-card">
            <video src={localVideoUrl} controls style={{ width: '100%', borderRadius: '4px' }} />
            <div className="video-footer">
              <h5 className="video-title">Randomized Quicksort</h5>
              <a className="download-link" href={localVideoUrl} download>Download</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LectureReview;