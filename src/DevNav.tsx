import { useState } from 'react'
import { PAGE_LIST, type Page } from './pages'

export default function DevNav({ page, onGo }: { page: Page; onGo: (page: Page) => void }) {
  const [open, setOpen] = useState(false)
  const groups = [...new Set(PAGE_LIST.map((item) => item.group))]

  return (
    <div className="dev-nav">
      {open && (
        <nav className="dev-nav-menu" aria-label="Developer page navigation">
          {groups.map((group) => (
            <div className="dev-nav-group" key={group}>
              <p>{group}</p>
              {PAGE_LIST.filter((item) => item.group === group).map((item) => (
                <button
                  className={item.id === page ? 'is-current' : ''}
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onGo(item.id)
                    setOpen(false)
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      )}
      <button className="dev-nav-toggle" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        DEV {open ? '×' : '☰'}
      </button>
    </div>
  )
}
