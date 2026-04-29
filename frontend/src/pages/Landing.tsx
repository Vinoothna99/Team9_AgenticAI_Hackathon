import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🔒',
    title: 'Private by default',
    desc: 'PII is masked before any AI ever sees your data.',
  },
  {
    icon: '🧠',
    title: 'Remembers context',
    desc: 'Understands your financial life and life events over time.',
  },
  {
    icon: '🔍',
    title: 'Live market data',
    desc: 'Searches the web for real-time financial information.',
  },
]

export default function Landing() {
  return (
    <div className="flex flex-col items-center gap-20 py-16">

      {/* Hero */}
      <section className="text-center flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-slate-100 leading-tight">
          Your AI-Powered<br />
          <span className="text-emerald-400">Financial Assistant</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md">
          Upload your statements. Ask anything. Your data stays private.
        </p>
        <div className="flex gap-4 mt-2">
          <Link
            to="/chat"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Start Chatting
          </Link>
          <Link
            to="/upload"
            className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100 px-6 py-2.5 rounded-lg transition-colors"
          >
            Upload CSV
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        {features.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-3"
          >
            <span className="text-2xl">{icon}</span>
            <h3 className="font-semibold text-slate-100">{title}</h3>
            <p className="text-slate-400 text-sm">{desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center flex flex-col items-center gap-4">
        <p className="text-slate-400 text-lg">Ready to take control of your finances?</p>
        <Link
          to="/chat"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </section>

    </div>
  )
}
