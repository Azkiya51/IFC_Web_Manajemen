import Bracket from '../components/Bracket'

export default function BracketPage() {
  return (
    <main className="view container">
      <div className="card mt-24">
        <h2>Bagan Turnamen dan Klasemen</h2>
        <p className="sub">24 tim · 6 grup (A–F) · 12 tim lolos ke babak gugur</p>
        <Bracket />
      </div>
    </main>
  )
}
