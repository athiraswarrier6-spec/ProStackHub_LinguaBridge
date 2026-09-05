import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('Auto Detect')
  const [targetLanguage, setTargetLanguage] = useState('English')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detectedLanguage, setDetectedLanguage] = useState('')

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('linguaBridgeHistory')) || []
    } catch {
      return []
    }
  })

  const saveToHistory = (source, target, original, translation) => {
    const historyItem = {
      id: Date.now(),
      source,
      target,
      original,
      translation,
      date: new Date().toLocaleString(),
    }

    const updatedHistory = [
      historyItem,
      ...history.filter(
        (item) =>
          !(
            item.source === source &&
            item.target === target &&
            item.original === original
          )
      ),
    ].slice(0, 20)

    setHistory(updatedHistory)
    localStorage.setItem(
      'linguaBridgeHistory',
      JSON.stringify(updatedHistory)
    )
  }

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError('Please enter some text to translate.')
      setTranslatedText('')
      return
    }

    if (sourceLanguage === targetLanguage) {
      setTranslatedText(text)
      setError('')

      saveToHistory(
        sourceLanguage,
        targetLanguage,
        text.trim(),
        text.trim()
      )

      return
    }

    setLoading(true)
    setError('')
    setTranslatedText('')
    setDetectedLanguage('')

    const cacheKey = `translation_${sourceLanguage}_${targetLanguage}_${text.trim()}`

    const cachedTranslation = localStorage.getItem(cacheKey)

    if (cachedTranslation) {
      setTranslatedText(cachedTranslation)
      setLoading(false)

      saveToHistory(
        sourceLanguage,
        targetLanguage,
        text.trim(),
        cachedTranslation
      )

      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Translation failed.')
      }

      setTranslatedText(data.translatedText)
      if (sourceLanguage === 'Auto Detect' && data.detectedLanguage) {
  setDetectedLanguage(data.detectedLanguage)
} else {
  setDetectedLanguage(sourceLanguage)
}
      

      localStorage.setItem(cacheKey, data.translatedText)

      saveToHistory(
        sourceLanguage,
        targetLanguage,
        text.trim(),
        data.translatedText
      )
    } catch (err) {
      console.error(err)

      setError(
        'Unable to translate right now. Make sure the backend server is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!translatedText) return

    try {
      await navigator.clipboard.writeText(translatedText)
      alert('Translation copied!')
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleSpeak = () => {
    if (!translatedText) return

    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(translatedText)

    const languageCodes = {
      English: 'en-US',
      Malayalam: 'ml-IN',
      Hindi: 'hi-IN',
      Spanish: 'es-ES',
      French: 'fr-FR',
      German: 'de-DE',
    }

    speech.lang = languageCodes[targetLanguage] || 'en-US'

    window.speechSynthesis.speak(speech)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('linguaBridgeHistory')
  }

  return (
    <div className="app">
      <header>
        <h1>🌐 LinguaBridge</h1>
        <p>Translate languages effortlessly with AI</p>
      </header>

      <main className="translator-container">
        <div className="language-selectors">
          <div>
            <label>From</label>

            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
            >
              <option>Auto Detect</option>
              <option>English</option>
              <option>Malayalam</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>

          <div>
            <label>To</label>

            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Malayalam</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>

        <div className="translation-boxes">
          <div className="text-box">
            <h3>Enter Text</h3>

            <textarea
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="text-box">
            <h3>Translation</h3>

            <div className="translated-text">
              {loading
                ? 'Translating...'
                : translatedText || 'Your translation will appear here...'}
            </div>

            {translatedText && (
              <div className="translation-actions">
                <button onClick={handleCopy}>📋 Copy</button>
                <button onClick={handleSpeak}>🔊 Listen</button>
              </div>
            )}
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button
          className="translate-btn"
          onClick={handleTranslate}
          disabled={loading}
        >
          {loading ? 'Translating...' : '✨ Translate'}
        </button>
      </main>

      <section className="history-section">
        <div className="history-header">
          <h2>🕘 Translation History</h2>

          {history.length > 0 && (
            <button className="clear-history-btn" onClick={clearHistory}>
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="empty-history">
            Your previous translations will appear here.
          </p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div className="history-item" key={item.id}>
                <div className="history-meta">
                  <strong>
                    {item.source} → {item.target}
                  </strong>

                  <span>{item.date}</span>
                </div>

                <div className="history-content">
                  <div>
                    <h4>Original</h4>
                    <p>{item.original}</p>
                  </div>

                  <div>
                    <h4>Translation</h4>
                    <p>{item.translation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default App