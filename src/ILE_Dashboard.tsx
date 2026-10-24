type ILEDashboardProps = {
  onRca: () => void
  onWhiteBelt: () => void
  onLogin: () => void
}

const learningPaths = [
  {
    number: '01',
    category: 'ROOT CAUSE ANALYSIS',
    title: 'RCA Training',
    description: 'Explore root cause analysis and practical problem-solving.',
    action: 'Open RCA training',
    logo: `${import.meta.env.BASE_URL}logos/RCA_logo1.svg`,
    logoAlt: 'RCA Training logo',
    onSelect: (props: ILEDashboardProps) => props.onRca(),
  },
  {
    number: '02',
    category: 'LEAN SIX SIGMA WB',
    title: 'LSS WB Module 1',
    description: 'Learn the foundations of continuous process improvement.',
    action: 'Open White Belt training',
    logo: `${import.meta.env.BASE_URL}logos/LSS_logo1.svg`,
    logoAlt: 'Lean Six Sigma White Belt logo',
    onSelect: (props: ILEDashboardProps) => props.onWhiteBelt(),
  },
]

export default function ILE_Dashboard({ onRca, onWhiteBelt, onLogin }: ILEDashboardProps) {
  const props = { onRca, onWhiteBelt, onLogin }

  return (
    <main className="ile-dashboard">
      <div className="ile-background" aria-hidden="true">
        <div className="ile-background-grid" />
        <div className="ile-light-beam" />
        <div className="ile-digital-squares">
          {Array.from({ length: 20 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>

      <div className="ile-dashboard-content">
        <header className="ile-dashboard-header">
          <a className="ile-dashboard-brand" href="#dashboard" aria-label="ILE Dashboard">
            <img
              className="ile-brand-logo"
              src={`${import.meta.env.BASE_URL}logos/innodata_logo.png`}
              alt="Innodata"
            />
            <span>INTERACTIVE LEARNING EXPERIENCE</span>
          </a>
          <div className="ile-dashboard-header-actions">
            <span className="ile-dashboard-status"><i /> LEARNING PORTAL</span>
            <button className="ile-login-button" type="button" onClick={onLogin}>Login</button>
          </div>
        </header>

        <section className="ile-dashboard-main" id="dashboard" aria-labelledby="ile-dashboard-title">
          <div className="ile-dashboard-intro">
            <p className="ile-eyebrow"><span /> YOUR LEARNING SPACE</p>
            <h1 id="ile-dashboard-title">ILE <strong>Dashboard</strong></h1>
            <p className="ile-dashboard-description">
              Choose a learning path and build practical skills for continuous improvement.
            </p>
          </div>

          <div className="ile-learning-paths" aria-label="Learning paths">
            {learningPaths.map((path) => (
              <button
                className="ile-learning-card"
                key={path.number}
                type="button"
                onClick={() => path.onSelect(props)}
                aria-label={path.action}
              >
                <span className="ile-card-topline">
                  {path.logo && (
                    <img className="ile-card-logo" src={path.logo} alt={path.logoAlt} />
                  )}
                  <span className="ile-card-arrow" aria-hidden="true">&#8599;</span>
                </span>
                <span className="ile-card-heading">
                  <span>
                    <span className="ile-card-category">{path.category}</span>
                    <span className="ile-card-title">{path.title}</span>
                  </span>
                </span>
                <span className="ile-card-description">{path.description}</span>
                <span className="ile-card-action">{path.action} <span aria-hidden="true">&gt;</span></span>
              </button>
            ))}
          </div>

          <p className="ile-dashboard-footnote">LEARN WITH PURPOSE. IMPROVE WITH CONFIDENCE.</p>
        </section>
      </div>
    </main>
  )
}
