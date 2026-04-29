import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from '@/components/Nav'
import Landing from '@/pages/Landing'
import Chat from '@/pages/Chat'
import Upload from '@/pages/Upload'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Nav />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
