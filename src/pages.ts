export type Page =
  | 'ile-dashboard'
  | 'login'
  | 'my-profile'
  | 'rca'
  | 'rca-problem'
  | 'rca-opening-3'
  | 'rca-agenda'
  | 'rca-expout'
  | 'rca-ref'
  | 'rca-what'
  | 'rca-what-2'
  | 'rca-pdca-1'
  | 'rca-probstate-1'
  | 'intro'
  | 'lean'
  | 'whitebelt'
  | 'lss1-q1'
  | 'lss1-q1-complete'
  | 'lss1-q1-failed'
  | 'game-1'

export const PAGE_LIST: { id: Page; label: string; group: string }[] = [
  { id: 'ile-dashboard', label: 'ILE Dashboard', group: 'General' },
  { id: 'login', label: 'Log In', group: 'General' },
  { id: 'my-profile', label: 'My Profile', group: 'General' },
  { id: 'rca', label: 'Opening 1 (title video)', group: 'RCA' },
  { id: 'rca-problem', label: 'Opening 2 (problem)', group: 'RCA' },
  { id: 'rca-opening-3', label: 'Opening 3 (approach)', group: 'RCA' },
  { id: 'rca-agenda', label: 'Agenda', group: 'RCA' },
  { id: 'rca-expout', label: 'Expected Outcome', group: 'RCA' },
  { id: 'rca-ref', label: 'Reflection', group: 'RCA' },
  { id: 'rca-what', label: 'What is a Problem', group: 'RCA' },
  { id: 'rca-what-2', label: 'The Problem', group: 'RCA' },
  { id: 'rca-pdca-1', label: 'PDCA Cycle', group: 'RCA' },
  { id: 'rca-probstate-1', label: 'Problem Statement', group: 'RCA' },
  { id: 'intro', label: 'LSS Opening', group: 'LSS White Belt' },
  { id: 'lean', label: 'Lean Six Sigma', group: 'LSS White Belt' },
  { id: 'whitebelt', label: 'White Belt', group: 'LSS White Belt' },
  { id: 'lss1-q1', label: 'LSS1_Q1', group: 'LSS White Belt' },
  { id: 'lss1-q1-complete', label: 'Quiz 1 Complete', group: 'LSS White Belt' },
  { id: 'lss1-q1-failed', label: 'You Failed the Course', group: 'LSS White Belt' },
  { id: 'game-1', label: 'Game 1', group: 'Mini games' },
]
