import { useState, type FormEvent } from 'react'

type LogInPageProps = {
  onBack: () => void
}

export default function LogInPage({ onBack }: LogInPageProps) {
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <main className="ile-dashboard ile-login-page">
      <div className="ile-background" aria-hidden="true">
        <div className="ile-background-grid" />
        <div className="ile-light-beam" />
        <div className="ile-digital-squares">
          {Array.from({ length: 20 }, (_, index) => <span key={index} />)}
        </div>
      </div>

      <div className="ile-dashboard-content">
        <header className="ile-dashboard-header">
          <button
            className="ile-login-brand"
            type="button"
            onClick={onBack}
            aria-label="Back to ILE Dashboard"
          >
            <img
              className="ile-brand-logo"
              src={`${import.meta.env.BASE_URL}logos/innodata_logo.png`}
              alt="Innodata"
            />
            <span>INTERACTIVE LEARNING EXPERIENCE</span>
          </button>
          <span className="ile-dashboard-status"><i /> LEARNING PORTAL</span>
        </header>

        <section className="ile-login-layout" aria-labelledby="login-title">
          <div className="ile-login-hero">
            <p className="ile-eyebrow"><span /> LEAN SIX SIGMA LEARNING</p>
            <h1>Better processes<br /><strong>start with you.</strong></h1>
            <p className="ile-dashboard-description">
              Build practical skills, solve problems with confidence, and make improvement part of the way you work.
            </p>
            <div className="ile-login-highlight">
              <span className="ile-login-highlight-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path d="M4 18V9m8 9V5m8 13v-6M2 18h20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              <span>
                <strong>Progress, made practical</strong>
                <small>Learn tools to turn insight into measurable change.</small>
              </span>
              <b aria-hidden="true">σ</b>
            </div>
          </div>

          <div className="ile-login-form-card">
            <p className="ile-login-kicker">YOUR NEXT STEP STARTS HERE</p>
            <h2 id="login-title">Welcome back</h2>
            <p className="ile-login-subtitle">Enter your credentials to access your training dashboard</p>

            <form className="ile-login-form" onSubmit={handleSubmit}>
              <label className="ile-login-field">
                <span>Email address</span>
                <span className="ile-login-input-wrap">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="m4.5 7 7.5 5.5L19.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
                </span>
              </label>

              <label className="ile-login-field">
                <span>Password</span>
                <span className="ile-login-input-wrap">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <rect x="4.5" y="10" width="15" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M8 10V7a4 4 0 1 1 8 0v3m-4 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <input
                    autoComplete="current-password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="ile-login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3 21 21M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.4 9.5 6-.4.7-1.3 2-2.8 3.2M6.2 6.3C4.3 7.5 3 9.2 2.5 11c.7 1.2 4 6 9.5 6 1 0 1.9-.2 2.7-.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                        <path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    )}
                  </button>
                </span>
              </label>

              <div className="ile-login-options">
                <label><input type="checkbox" name="remember" /> Remember me</label>
                <a href="#forgot-password">Forgot password?</a>
              </div>

              <button className="ile-login-submit" type="submit">
                Sign In
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <div className="ile-login-divider"><span>OR CONTINUE WITH</span></div>

            <button className="ile-login-microsoft" type="button">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path fill="#f25022" d="M2 2h9.5v9.5H2z" />
                <path fill="#7fba00" d="M12.5 2H22v9.5h-9.5z" />
                <path fill="#00a4ef" d="M2 12.5h9.5V22H2z" />
                <path fill="#ffb900" d="M12.5 12.5H22V22h-9.5z" />
              </svg>
              Log in with Microsoft
            </button>

            <p className="ile-login-signup">Don&apos;t have an account? <a href="#sign-up">Sign up</a></p>
          </div>
        </section>
      </div>
    </main>
  )
}
