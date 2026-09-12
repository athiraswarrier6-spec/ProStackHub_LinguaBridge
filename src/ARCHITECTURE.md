# LinguaBridge Architecture

## 1. Overview

LinguaBridge is an AI-powered language translation web application built using React, Vite, Node.js, Express, and the Google Gemini API.

The application allows users to:
- Select source and target languages
- Automatically detect the source language
- Translate text using Google Gemini
- Copy translated text
- Listen to translated text using text-to-speech
- Store translations in local history
- Cache translations locally in the browser

## 2. System Architecture

```text
                    User
                      |
                      v
             React + Vite Frontend
                    (Vercel)
                      |
                      | POST /api/translate
                      v
             Node.js + Express Backend
                    (Render)
                      |
                      | Gemini API Request
                      v
                Google Gemini API
3. Frontend Architecture

The frontend is developed using React and Vite.

The main frontend responsibilities are:

User interface for translation
Source and target language selection
Text input and translation display
Automatic language detection display
Copy translated text
Text-to-speech playback
Translation history
Local translation caching

The main React component is src/App.jsx.

The application styling is implemented using CSS files inside the src directory.

4. Backend Architecture

The backend is implemented using Node.js and Express.

The backend is located in:

server/index.js

It provides the API endpoint:

POST /api/translate

The backend:

Receives the text and selected languages.
Validates the input.
Creates the translation prompt.
Sends the prompt to Google Gemini.
Processes the Gemini response.
Returns the translated text to the frontend.
5. AI Integration

LinguaBridge uses the Google Gemini API through the @google/genai package.

The Gemini API key is stored as an environment variable:

GEMINI_API_KEY

The API key is used only by the backend and is not exposed in the React frontend.

6. Automatic Language Detection

When the user selects Auto Detect, the backend asks Gemini to identify the source language and translate the text into the selected target language.

The backend processes the response and returns:

translatedText
detectedLanguage

to the frontend.

7. Local Storage

The browser's localStorage is used for:

Translation Cache

Previously translated text is cached locally so repeated translations can be retrieved without sending another API request.

Translation History

The application stores recent translations locally in the browser.

The history contains:

Source language
Target language
Original text
Translation
Date and time
8. Deployment Architecture
Frontend

The React/Vite frontend is deployed using:

Vercel

Live application:

https://pro-stack-hub-lingua-bridge.vercel.app/
Backend

The Node.js/Express backend is deployed using:

Render

The frontend communicates with the deployed backend through the /api/translate endpoint.

Source Control

The complete project source code is maintained in GitHub.

Repository:

https://github.com/athiraswarrier6-spec/ProStackHub_LinguaBridge
9. Architecture Decisions
Separate Frontend and Backend

The frontend and backend are separated so that the React application handles the user interface while the backend handles API communication and Gemini integration.

Server-side API Key

The Gemini API key is kept on the backend as an environment variable. This prevents the secret from being exposed in client-side code.

REST API Communication

The frontend communicates with the backend using HTTP requests. This keeps the frontend and backend loosely coupled.

Local Storage

Local storage was selected for translation history and caching because the application does not require a database for its current scope.

10. Challenges Faced
Challenge 1: Deployment of Frontend and Backend

The local application worked with separate frontend and backend servers, but the production frontend needed to communicate with the deployed backend.

Solution: The frontend was configured to send translation requests to the deployed Render backend.

Challenge 2: CSS Build Error

During Vercel deployment, the production build initially failed because JavaScript import statements were accidentally placed in a CSS file.

This produced a Vite/Lightning CSS syntax error.

Solution: The JavaScript and CSS files were separated correctly, the stylesheet imports were corrected, and the production build was tested locally using:

npm run build

After fixing the issue, the production build completed successfully.

Challenge 3: Environment Variables

The Gemini API key must not be committed to GitHub.

Solution: The key is stored as GEMINI_API_KEY in the Render environment variables, while the repository contains only the example environment configuration.

Challenge 4: Free Hosting

The backend uses a free hosting plan, so the service may temporarily sleep after inactivity.

Solution: The application is designed to work with the free hosting environment while keeping deployment costs low for the project demonstration.

11. Technologies Used
React
Vite
JavaScript
CSS
Node.js
Express
Google Gemini API
@google/genai
Web Speech API
Browser Local Storage
GitHub
Vercel
Render
12. Future Improvements

Possible future improvements include:

User authentication
Persistent database-backed translation history
More language support
Translation rate limiting
Multiple AI translation providers
Improved error handling
Analytics and usage monitoring                