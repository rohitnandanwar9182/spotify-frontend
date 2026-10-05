import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register({ username, email, password, role })
      navigate(user.role === 'artist' ? '/dashboard' : '/browse')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-6 max-w-sm px-1 sm:mt-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">side b</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">Create an account</h1>
      <p className="mt-2 text-sm text-muted">Listen as a fan, or upload as an artist.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex gap-2 rounded-full border border-hairline bg-surface p-1">
          {['user', 'artist'].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              className={`press flex-1 rounded-full py-1.5 text-xs font-semibold capitalize transition-colors ${
                role === r ? 'bg-amber text-ink' : 'text-muted hover:text-paper'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Username</span>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm text-paper outline-none transition-colors focus:border-amber"
            placeholder="tapehead"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm text-paper outline-none transition-colors focus:border-amber"
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm text-paper outline-none transition-colors focus:border-amber"
            placeholder="••••••••"
          />
        </label>

        {error && <p className="animate-fade-in text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="press mt-2 rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-ink shadow-md shadow-amber/20 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-amber/30 disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-amber transition-opacity hover:opacity-80 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
