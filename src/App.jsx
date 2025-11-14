import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [text, setText] = useState('Make something wonderful in pastel vibes ✨')
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [error, setError] = useState('')
  const [duration, setDuration] = useState(3)

  const generate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setVideoUrl('')
    try {
      const res = await fetch(`${API_BASE}/api/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, duration }),
      })
      if (!res.ok) throw new Error('Failed to generate video')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-2xl shadow-xl border border-white/60 backdrop-blur bg-white/70">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-slate-800">Pastel Text → Video</h1>
          <p className="text-slate-600 mt-1">Type your message and get a short pastel-themed video with a soft fade.</p>

          <form onSubmit={generate} className="mt-6 space-y-4">
            <textarea
              className="w-full h-28 rounded-xl border border-slate-200 bg-white/80 p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-pink-200/60"
              placeholder="Write your text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              required
            />

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <label className="flex items-center gap-3 text-slate-700">
                <span className="text-sm">Duration</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
                <span className="text-sm font-medium">{duration}s</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-pink-500 text-white shadow hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Generating…' : 'Generate Video'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 text-sm text-red-600">{error}</div>
          )}

          {videoUrl && (
            <div className="mt-6">
              <video src={videoUrl} controls className="w-full rounded-xl border border-slate-200 shadow" />
              <a
                href={videoUrl}
                download="text_video.mp4"
                className="inline-block mt-3 text-sm text-pink-600 hover:underline"
              >
                Download video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
