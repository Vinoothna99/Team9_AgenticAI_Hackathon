import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Is the backend running?' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Chat with VaultAI</h1>

      <div className="flex flex-col gap-3 min-h-96 max-h-[60vh] overflow-y-auto rounded-xl border border-slate-800 p-4 bg-slate-900">
        {messages.length === 0 && (
          <p className="text-slate-500 text-sm">
            Ask about your finances. Upload a CSV first to get spending insights.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-lg px-4 py-2 max-w-[80%] text-sm whitespace-pre-wrap ${
              m.role === 'user'
                ? 'self-end bg-emerald-700 text-white'
                : 'self-start bg-slate-800 text-slate-100'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-slate-800 rounded-lg px-4 py-2 text-sm text-slate-400 animate-pulse">
            VaultAI is thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything about your finances..."
          className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-5 py-2 text-sm font-medium text-white transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}
