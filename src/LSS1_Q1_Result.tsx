import { CorridorScene } from './LSS1_1'

type LSS1Q1ResultPageProps = {
  passed: boolean
  onRetry: () => void
  onDashboard: () => void
}

export default function LSS1Q1ResultPage({ passed, onRetry, onDashboard }: LSS1Q1ResultPageProps) {
  const title = passed ? 'Quiz 1: Course complete' : 'You failed the course'
  const description = passed
    ? 'You selected the correct answer. You understand how Lean Six Sigma works to reduce waste, solve problems, and improve processes.'
    : 'Your answer was not correct. Review the Lean Six Sigma principles and try Quiz 1 again.'

  return (
    <main className="ile-dashboard lss1-result-page">
      <div className="ile-background" aria-hidden="true">
        <div className="ile-background-grid" />
        <div className="ile-light-beam" />
        <div className="ile-digital-squares">
          {Array.from({ length: 20 }, (_, index) => <span key={index} />)}
        </div>
      </div>
      <div className="lss1-result-corridor" aria-hidden="true"><CorridorScene /></div>
      <div className="ile-dashboard-content lss1-result-content">
        <header className="ile-dashboard-header">
          <button className="game1-home" type="button" onClick={onDashboard} aria-label="Back to ILE Dashboard">
            <img className="ile-brand-logo" src={`${import.meta.env.BASE_URL}logos/innodata_logo.png`} alt="" />
            <span>INTERACTIVE LEARNING EXPERIENCE</span>
          </button>
          <span className="ile-dashboard-status"><i /> LEARNING PORTAL</span>
        </header>

        <section className={`lss1-result-card${passed ? ' is-passed' : ' is-failed'}`} aria-labelledby="lss1-result-title">
          <p className="ile-eyebrow"><span /> QUIZ 1 / COURSE OUTCOME</p>
          <span className="lss1-result-mark" aria-hidden="true">{passed ? '✓' : '!'}</span>
          <h1 id="lss1-result-title">{title}</h1>
          <p className="lss1-result-description">{description}</p>
          <div className="lss1-result-actions">
            {passed ? (
              <button className="next-button" type="button" onClick={onDashboard}>
                Back to learning portal <span aria-hidden="true">&gt;</span>
              </button>
            ) : (
              <button className="next-button" type="button" onClick={onRetry}>
                Try Quiz 1 again <span aria-hidden="true">&gt;</span>
              </button>
            )}
            <button className="back-button" type="button" onClick={onDashboard}>
              ILE Dashboard
            </button>
          </div>
          <p className="lss1-result-footnote">LEAN SIX SIGMA / WHITE BELT</p>
        </section>
      </div>
    </main>
  )
}
