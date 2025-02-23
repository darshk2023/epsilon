# Epsilon AI - Intelligent Course Assistant

Epsilon AI is a React-based web application that serves as an intelligent course assistant, providing students with personalized learning experiences through three main features: Lecture Review, On-Demand Office Hours, and Concept Quizzes.

## Features

1. Lecture Review

- Generate personalized video explanations of course concepts
- AI-powered content generation using OpenAI's GPT-4
- Text-to-speech conversion with ElevenLabs
- Lip-sync technology for natural video presentations
- Downloadable review videos

2. On-Demand Office Hours

- Real-time conversations with an AI teaching assistant
- Context-aware responses based on course materials
- Conversation history tracking
- Transcript summaries for past sessions

3. Concept Quizzes

- Interactive quizzes to test understanding
- Adaptive questioning based on performance
- Quiz history tracking
- Planned quizzes based on office hours interactions

## Technology Stack

- Frontend: React.js
- Styling: CSS with Tailwind
- PDF Processing: pdf-parse
- AI Integration: OpenAI API
- Voice Synthesis: ElevenLabs API
- Video Processing: FAL.ai

## Installation

1. Clone the repository:

```bash
git clone https://github.com/darshk2023/epsilon.git
cd epsilon
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:

```bash
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_api_key
FAL_KEY=your_fal_key
```

## Running the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

src/
├── components/ # Reusable React components
├── pages/ # Page components
├── App.js # Main application component
├── index.js # Entry point for the application
└── index.css # Global styles

## License

This project is licensed under the MIT License - see the LICENSE file for details:

MIT License

Copyright (c) 2025 Darsh Khandelwal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
