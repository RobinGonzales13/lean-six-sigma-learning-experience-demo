import { useState, type FormEvent } from 'react'

type MyProfileProps = {
  onBack: () => void
}

const initialProfile = {
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  email: 'juan.delacruz@innodata.net',
  jobTitle: 'Graphic Artist',
  deliveryUnit: 'AI/LLM Practice',
  projectName: 'Meta Data Annotation',
  supervisor: 'Jose Mari Gutierrez',
  jobLevel: 'Level 3',
  employeeCode: '2PH1999',
  hireDate: '2026-07-18',
  username: 'juan.delacruz',
}

function SectionIcon({ type }: { type: 'profile' | 'security' | 'notifications' }) {
  if (type === 'security') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <rect x="4.5" y="10" width="15" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 10V7a4 4 0 1 1 8 0v3m-4 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'notifications') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c.6-3.3 3.1-5 7-5s6.4 1.7 7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function MyProfile({ onBack }: MyProfileProps) {
  const [firstName, setFirstName] = useState(initialProfile.firstName)
  const [lastName, setLastName] = useState(initialProfile.lastName)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [excludeEmails, setExcludeEmails] = useState(false)
  const [notice, setNotice] = useState('')
  const profileInitials = `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase()

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('Profile changes saved in this session.')
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (formData.get('newPassword') !== formData.get('confirmPassword')) {
      setNotice('New password and confirmation do not match.')
      return
    }
    setNotice('Password change is ready for authentication integration.')
    event.currentTarget.reset()
    setPasswordOpen(false)
  }

  return (
    <main className="ile-dashboard ile-profile-page">
      <div className="ile-background" aria-hidden="true">
        <div className="ile-background-grid" />
        <div className="ile-light-beam" />
        <div className="ile-digital-squares">
          {Array.from({ length: 20 }, (_, index) => <span key={index} />)}
        </div>
      </div>

      <div className="ile-dashboard-content ile-profile-content">
        <header className="ile-dashboard-header">
          <button className="ile-login-brand" type="button" onClick={onBack} aria-label="Back to ILE Dashboard">
            <img className="ile-brand-logo" src={`${import.meta.env.BASE_URL}logos/innodata_logo.png`} alt="Innodata" />
            <span>INTERACTIVE LEARNING EXPERIENCE</span>
          </button>
          <span className="ile-dashboard-status"><i /> LEARNING PORTAL</span>
        </header>

        <section className="ile-profile-main" aria-labelledby="profile-title">
          <div className="ile-profile-page-heading">
            <div>
              <p className="ile-eyebrow"><span /> ACCOUNT SETTINGS</p>
              <h1 id="profile-title">My <strong>Profile</strong></h1>
              <p className="ile-profile-subtitle">Manage your account details, security credentials, and email preferences.</p>
            </div>
            <button className="ile-profile-back" type="button" onClick={onBack}>
              <span aria-hidden="true">←</span> Dashboard
            </button>
          </div>

          <div className="ile-profile-summary">
            <div className="ile-profile-avatar" aria-hidden="true">{profileInitials || '—'}</div>
            <div className="ile-profile-summary-copy">
              <h2>{firstName} {lastName}</h2>
              <p>{initialProfile.jobTitle} <span>·</span> {initialProfile.deliveryUnit}</p>
            </div>
            <span className="ile-profile-employee-badge"><i /> ACTIVE EMPLOYEE</span>
          </div>

          {notice && (
            <div className="ile-profile-notice" role="status">
              <span aria-hidden="true">✓</span>{notice}
              <button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button>
            </div>
          )}

          <form className="ile-profile-card" onSubmit={handleProfileSubmit}>
            <div className="ile-profile-card-heading">
              <span className="ile-profile-section-icon"><SectionIcon type="profile" /></span>
              <div>
                <h2>Basic Information</h2>
                <p>Keep your personal and work details up to date.</p>
              </div>
            </div>

            <div className="ile-profile-grid">
              <label className="ile-profile-field">
                <span>First Name</span>
                <input name="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
              </label>
              <label className="ile-profile-field">
                <span>Last Name</span>
                <input name="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
              </label>
              <label className="ile-profile-field ile-profile-email-field">
                <span>Email</span>
                <span className="ile-profile-email-wrap">
                  <input name="email" type="email" defaultValue={initialProfile.email} required />
                  <svg aria-label="Email address verified" role="img" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" fill="currentColor" />
                    <path d="m6.5 10 2.2 2.2 4.8-4.8" stroke="#041027" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </label>
              <label className="ile-profile-field">
                <span>Job Title</span>
                <input name="jobTitle" defaultValue={initialProfile.jobTitle} />
              </label>
              <label className="ile-profile-field">
                <span>Delivery Unit</span>
                <input name="deliveryUnit" defaultValue={initialProfile.deliveryUnit} />
              </label>
              <label className="ile-profile-field">
                <span>Project Name</span>
                <input name="projectName" defaultValue={initialProfile.projectName} />
              </label>
              <label className="ile-profile-field">
                <span>Name of Immediate Supervisor</span>
                <input name="supervisor" defaultValue={initialProfile.supervisor} />
              </label>
              <label className="ile-profile-field">
                <span>Job Level</span>
                <input name="jobLevel" defaultValue={initialProfile.jobLevel} />
              </label>
              <label className="ile-profile-field">
                <span>Employee Code</span>
                <input name="employeeCode" defaultValue={initialProfile.employeeCode} readOnly />
              </label>
              <label className="ile-profile-field">
                <span>Hire Date</span>
                <input name="hireDate" type="date" defaultValue={initialProfile.hireDate} />
              </label>
            </div>

            <div className="ile-profile-card-footer">
              <span>Changes are saved locally for this demo.</span>
              <button className="ile-profile-primary" type="submit">Save Changes</button>
            </div>
          </form>

          <section className="ile-profile-card" aria-labelledby="profile-security-title">
            <div className="ile-profile-card-heading">
              <span className="ile-profile-section-icon"><SectionIcon type="security" /></span>
              <div>
                <h2 id="profile-security-title">Sign-in Credentials</h2>
                <p>Manage the credentials you use to access your learning account.</p>
              </div>
            </div>
            <div className="ile-profile-username-row">
              <label className="ile-profile-field">
                <span>Username</span>
                <input name="username" defaultValue={initialProfile.username} readOnly />
              </label>
              <button className="ile-profile-secondary" type="button" onClick={() => { setPasswordOpen(!passwordOpen); setNotice('') }}>
                {passwordOpen ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            {passwordOpen && (
              <form className="ile-profile-password-form" onSubmit={handlePasswordSubmit}>
                <label className="ile-profile-field">
                  <span>Current Password</span>
                  <input name="currentPassword" type="password" autoComplete="current-password" required />
                </label>
                <label className="ile-profile-field">
                  <span>New Password</span>
                  <input name="newPassword" type="password" autoComplete="new-password" minLength={8} required />
                </label>
                <label className="ile-profile-field">
                  <span>Confirm New Password</span>
                  <input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
                </label>
                <button className="ile-profile-primary" type="submit">Update Password</button>
              </form>
            )}
          </section>

          <section className="ile-profile-card" aria-labelledby="profile-notifications-title">
            <div className="ile-profile-card-heading">
              <span className="ile-profile-section-icon"><SectionIcon type="notifications" /></span>
              <div>
                <h2 id="profile-notifications-title">Email &amp; Notification Settings</h2>
                <p>Choose how you would like to hear from us.</p>
              </div>
            </div>
            <label className="ile-profile-toggle-row">
              <span className="ile-profile-toggle-copy">
                <strong>Exclude from all non-essential emails and notifications</strong>
                <small>Includes learning tips, product updates, announcements, and other optional communications. Essential account and training messages may still be sent.</small>
              </span>
              <input
                aria-label="Exclude from all non-essential emails and notifications"
                checked={excludeEmails}
                className="ile-profile-toggle"
                onChange={(event) => setExcludeEmails(event.target.checked)}
                type="checkbox"
              />
            </label>
          </section>
        </section>
      </div>
    </main>
  )
}
