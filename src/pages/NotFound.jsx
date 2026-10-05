import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mt-14 text-center sm:mt-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">side c</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">Dead air</h1>
      <p className="mt-2 text-sm text-muted">Nothing's playing on this track.</p>
      <Link
        to="/"
        className="mt-6 inline-block text-amber transition-opacity hover:opacity-80 hover:underline"
      >
        Back to the deck
      </Link>
    </div>
  )
}
