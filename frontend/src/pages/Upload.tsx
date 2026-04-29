import { useState, useRef } from 'react'

type Status = 'idle' | 'masking' | 'uploading' | 'done' | 'error'

export default function Upload() {
  const [status, setStatus] = useState<Status>('idle')
  const [rowCount, setRowCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setError('Please select a .csv file.')
      setStatus('error')
      return
    }
    setError(null)
    setStatus('masking')
    await new Promise((r) => setTimeout(r, 600))
    setStatus('uploading')

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('/api/upload-csv', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Upload failed')
      setRowCount(data.rows)
      setStatus('done')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
      setStatus('error')
    }
  }

  const statusMessage: Record<Status, string> = {
    idle: 'Click to select a CSV file',
    masking: 'Masking sensitive data...',
    uploading: 'Uploading...',
    done: '',
    error: '',
  }

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-100">Upload CSV</h2>
        <p className="text-slate-400 text-sm mt-2">
          Your data is private. PII is masked before any AI sees it.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
        className="w-full max-w-md border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-12 flex flex-col items-center gap-3 cursor-pointer transition-colors"
      >
        <span className="text-4xl">📂</span>
        <p className="text-slate-400 text-sm text-center">
          {status === 'idle' || status === 'error'
            ? 'Drag & drop a CSV here or click to browse'
            : statusMessage[status]}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </div>

      {/* Loading states */}
      {(status === 'masking' || status === 'uploading') && (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          {statusMessage[status]}
        </div>
      )}

      {/* Success */}
      {status === 'done' && rowCount !== null && (
        <div className="bg-emerald-950 border border-emerald-800 rounded-xl px-6 py-4 text-center">
          <p className="text-emerald-400 font-semibold text-lg">{rowCount} rows uploaded</p>
          <p className="text-slate-400 text-sm mt-1">
            Your data is private and stored securely. Go to{' '}
            <a href="/chat" className="text-emerald-400 hover:underline">
              Chat
            </a>{' '}
            to ask questions about it.
          </p>
        </div>
      )}

      {/* Error */}
      {status === 'error' && error && (
        <div className="bg-red-950 border border-red-800 rounded-xl px-6 py-4 text-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
