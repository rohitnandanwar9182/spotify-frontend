import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login({ identifier, password })
      navigate(user.role === 'artist' ? '/dashboard' : '/browse')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-12 max-w-sm">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">side a</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-paper">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Log in to keep the reel spinning.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Username or email</span>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm text-paper outline-none focus:border-amber"
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm text-paper outline-none focus:border-amber"
            placeholder="••••••••"
          />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New here?{' '}
        <Link to="/register" className="text-amber hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
