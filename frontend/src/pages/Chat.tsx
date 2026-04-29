//complex of the three pages, managing multiple pieces of state and an async API call

import {useState, useRef, useEffect} from 'react'

interface Message{
    role : 'user' | 'assistant'
    content: string 
}

export default function Chat(){
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('') // input is a state, intial value is string, type is string
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    async function sendMessages(){ 
        if (!input.trim() || loading) return // base case
        const userMsg: Message = { role: 'user', content: input}
        setMessages((prev) => [...prev,userMsg])
        setInput('')
        setLoading(true)
   

        try{

            const res = await fetch('/api/chat',{
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({message: userMsg.content}),
            })

            const data = await res.json()
            setMessages((prev) => [...prev,{role: 'assistant', content: data.message}])
        }

        catch{
            setMessages((prev) => [...prev,{role: 'assistant', content: 'Something went wrong. Is the backend running?'},])
        }

        finally{
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">

            {/* Message list */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
                {messages.length === 0 && (
                    <p className="text-slate-500 text-sm text-center mt-16">
                        Ask anything about your finances.
                    </p>
                )}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                msg.role === 'user'
                                    ? 'bg-emerald-600 text-white rounded-br-sm'
                                    : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {/* Loading dots */}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="flex gap-2 pt-4 border-t border-slate-800">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessages()}
                    placeholder="Ask about your finances..."
                    disabled={loading}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
                <button
                    onClick={sendMessages}
                    disabled={loading || !input.trim()}
                    className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                >
                    Send
                </button>
            </div>

        </div>
    )

}
