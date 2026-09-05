# 🌐 LinguaBridge

LinguaBridge is an AI-powered language translation web application built using React and the Gemini API.

It allows users to translate text between multiple languages, automatically detect the source language, copy translations, listen to translated text, and maintain a local translation history.

## ✨ Features

- 🌍 Source and target language selection
- 🔍 Automatic source-language detection
- 🤖 AI-powered translation using Google Gemini
- 📝 Preserves paragraphs, line breaks, punctuation, and lists
- 📋 Copy translated text
- 🔊 Text-to-speech playback
- 💾 Local translation caching
- 🕘 Browsable translation history
- 🗑️ Clear translation history
- 📱 Responsive user interface

## 🛠️ Technologies Used

- React
- Vite
- JavaScript
- CSS
- Node.js
- Express
- Google Gemini API
- Web Speech API
- Browser Local Storage

## 📁 Project Structure

```text
LinguaBridge/
├── public/
├── server/
│   ├── .env.example
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
└── vite.config.js