import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Order Manager. How can I help you today? You can say things like "Show my orders" or "Order a laptop".' }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', text: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: input.trim()
      })

      if (!response.ok) throw new Error('Failed to reach AI service')

      const data = await response.text()
      setMessages(prev => [...prev, { role: 'ai', text: data }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: ' + error.message }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Order Manager</h1>
        <div className="status-badge">Powered by Gemini</div>
      </header>
      
      <main className="chat-window">
        <div className="messages-container">
          {messages.map((m, i) => (
            <div key={i} className={`message-bubble ${m.role}`}>
              <div className="message-content">
                {m.text.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-bubble ai loading">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="input-area">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything or place an order..."
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App
