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

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Upload Bank Statement</h1>
      <p className="text-slate-400 text-sm">
        Export your bank statement as a CSV and drop it below. Your data stays local — it never
        leaves this device.
      </p>

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-700 rounded-xl p-16 text-center cursor-pointer hover:border-emerald-500 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
        <p className="text-slate-400 text-sm">Drag and drop a CSV here, or click to browse</p>
      </div>

      {status === 'masking' && (
        <div className="flex items-center gap-2 text-sm text-amber-400">
          <span className="animate-spin inline-block">⟳</span>
          Masking locally... your raw data stays on this device.
        </div>
      )}
      {status === 'uploading' && (
        <p className="text-sm text-slate-400 animate-pulse">Sending to local agent...</p>
      )}
      {status === 'done' && rowCount !== null && (
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-700 text-white text-xs px-3 py-1 font-medium">
            Loaded
          </span>
          <span className="text-slate-300 text-sm">
            {rowCount} transactions ready. Go to Chat to analyze them.
          </span>
        </div>
      )}
      {status === 'error' && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
