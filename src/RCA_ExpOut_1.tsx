export default function RcaExperienceOutcomes({ onBack }: { onBack: () => void }) {
  return (
    <main className="rca-page rca-grid-page" aria-label="Root Cause Analysis experience outcomes">
      <div className="rca-grid-scene" aria-hidden="true">
        <div className="rca-grid-glow" />
        <div className="rca-grid-lines" />
        <div className="rca-grid-sweep" />
      </div>
      <section className="rca-board" aria-labelledby="rca-expout-title">
        <header className="rca-board-header">
          <p className="rca-board-kicker"><span /> ROOT CAUSE ANALYSIS / LEARNING OUTCOMES</p>
          <h1 id="rca-expout-title">EXPECTED OUTCOME</h1>
          <span className="rca-board-rule" aria-hidden="true" />
        </header>
        <div className="rca-board-content">
          <p className="rca-board-intro">
            By the end of this training, you will be able to approach problems with clarity and structure.
          </p>
          <p className="rca-expout-lead">This includes:</p>
          <ul className="rca-expout-list" aria-label="Expected outcomes">
            <li>Defining problems based on measurable impact</li>
            <li>Identifying waste that reduces efficiency</li>
            <li>Distinguishing symptoms from root causes</li>
            <li>Applying solutions that are sustainable and repeatable</li>
          </ul>
          <p className="rca-board-conclusion">
            The focus is not just solving problems but improving how problems are solved.
          </p>
        </div>
      </section>
      <button className="back-button rca-back" type="button" onClick={onBack}>
        <span aria-hidden="true">&lt;</span> Back
      </button>
    </main>
  )
}
