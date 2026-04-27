import { useEffect, useState } from 'react'

interface LifeEvent {
  eventType: string
  detail: string
  date: string
}

export default function Dashboard() {
  const [events, setEvents] = useState<LifeEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/life-events')
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="text-slate-400 text-sm">
        Upload a CSV and ask VaultAI to forecast your cash flow to see summary cards here.
      </p>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-base font-medium text-slate-300 mb-4">Life Events</h2>
        {loading ? (
          <p className="text-slate-500 text-sm animate-pulse">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No life events recorded yet. Tell VaultAI about major life changes in the chat (e.g.
            "I just had a baby" or "I got a new job").
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {events.map((e, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-emerald-900 text-emerald-300 text-xs px-2 py-0.5 font-medium mt-0.5 shrink-0">
                  {e.eventType}
                </span>
                <span className="text-slate-300">{e.detail}</span>
                <span className="text-slate-500 text-xs ml-auto shrink-0">{e.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
