import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'

const answers = ['Do', 'Plan', 'Check', 'Act']
const puzzlePieceAssets = Array.from(
  { length: 9 },
  (_, index) => `${import.meta.env.BASE_URL}RCA_page/img/1x/Asset ${index + 1}.png`,
)
type PieceId =
  | 'slot'
  | 'cycle-do'
  | 'cycle-check'
  | 'cycle-act'
  | 'answer-do'
  | 'answer-plan'
  | 'answer-check'
  | 'answer-act'

function createRandomPieceAssets(): Record<PieceId, string> {
  const shuffled = [...puzzlePieceAssets]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return {
    slot: shuffled[0],
    'cycle-do': shuffled[1],
    'cycle-check': shuffled[2],
    'cycle-act': shuffled[3],
    'answer-do': shuffled[4],
    'answer-plan': shuffled[5],
    'answer-check': shuffled[6],
    'answer-act': shuffled[7],
  }
}

function PuzzlePieceArt({ className, asset }: { className: string; asset: string }) {
  return (
    <span
      className={className}
      style={{
        maskImage: `url("${asset}")`,
        WebkitMaskImage: `url("${asset}")`,
      }}
      aria-hidden="true"
    />
  )
}

function PuzzleHole({
  selectedAnswer,
  complete,
  asset,
  onClick,
  isDraggingOver,
}: {
  selectedAnswer: string | null
  complete: boolean
  asset: string
  onClick: () => void
  isDraggingOver: boolean
}) {
  return (
    <button
      className={`game1-puzzle-hole${selectedAnswer ? ' has-selection' : ''}${complete ? ' is-complete' : ''}${isDraggingOver ? ' is-drag-over' : ''}`}
      type="button"
      aria-label={complete ? 'Correct answer: Plan' : `Puzzle answer slot${selectedAnswer ? `, selected answer: ${selectedAnswer}` : ''}. Drop an answer here or select an answer and activate this slot.`}
      onClick={onClick}
    >
      <PuzzlePieceArt className="game1-puzzle-outline" asset={asset} />
      <span className="game1-hole-letter">P</span>
      <span className="game1-hole-caption">{complete ? 'PLAN' : selectedAnswer || 'DROP ANSWER'}</span>
    </button>
  )
}

export default function GameOnePage({ onBack }: { onBack: () => void }) {
  const pageRef = useRef<HTMLElement>(null)
  const suppressClickRef = useRef(false)
  const draggingAnswerRef = useRef<string | null>(null)
  const [dragPoint, setDragPoint] = useState<{ x: number; y: number } | null>(null)
  const [pieceAssets, setPieceAssets] = useState(createRandomPieceAssets)
  const [usedAnswers, setUsedAnswers] = useState<Set<string>>(() => new Set())
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [draggingAnswer, setDraggingAnswer] = useState<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0 })
  }, [])

  function submitAnswer(answer: string, placePiece = false) {
    if (complete || !answers.includes(answer) || usedAnswers.has(answer)) return
    setAttempts((count) => count + 1)
    if (placePiece) {
      setUsedAnswers((used) => new Set(used).add(answer))
    }

    if (answer === 'Plan') {
      setSelectedAnswer(answer)
      setComplete(true)
      setFeedback('Correct — P stands for Plan.')
      return
    }

    if (placePiece) setSelectedAnswer(null)
    setFeedback(`${answer} is another PDCA phase. Try again.`)
  }

  function resetGame() {
    setPieceAssets(createRandomPieceAssets())
    setSelectedAnswer(null)
    setUsedAnswers(new Set())
    setDraggingAnswer(null)
    draggingAnswerRef.current = null
    setDragPoint(null)
    setIsDraggingOver(false)
    setFeedback('')
    setAttempts(0)
    setComplete(false)
  }

  function handleAnswerPointerDown(event: ReactPointerEvent<HTMLButtonElement>, answer: string) {
    if (complete || event.button !== 0) return
    draggingAnswerRef.current = answer
    setDraggingAnswer(answer)
    setDragPoint({ x: event.clientX, y: event.clientY })
    setSelectedAnswer(answer)
    setFeedback('Drag this piece into the missing P slot.')
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleAnswerPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!draggingAnswerRef.current) return
    setDragPoint({ x: event.clientX, y: event.clientY })
    setIsDraggingOver(Boolean(
      document.elementFromPoint(event.clientX, event.clientY)?.closest('.game1-hole-target'),
    ))
  }

  function handleAnswerPointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    const answer = draggingAnswerRef.current
    if (!answer) return
    const droppedOnPuzzle = Boolean(
      document.elementFromPoint(event.clientX, event.clientY)?.closest('.game1-hole-target'),
    )
    draggingAnswerRef.current = null
    setDraggingAnswer(null)
    setDragPoint(null)
    setIsDraggingOver(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (droppedOnPuzzle) {
      suppressClickRef.current = true
      submitAnswer(answer, true)
      window.setTimeout(() => { suppressClickRef.current = false }, 0)
    }
  }

  return (
    <main ref={pageRef} className="ile-dashboard game1-page">
      <div className="ile-background" aria-hidden="true">
        <div className="ile-background-grid" />
        <div className="ile-light-beam" />
        <div className="ile-digital-squares">{Array.from({ length: 20 }, (_, index) => <span key={index} />)}</div>
      </div>
      <div className="ile-dashboard-content">
        <header className="ile-dashboard-header">
          <button className="game1-home" type="button" onClick={onBack} aria-label="Back to ILE Dashboard">
            <img className="ile-brand-logo" src={`${import.meta.env.BASE_URL}logos/innodata_logo.png`} alt="" />
            <span>INTERACTIVE LEARNING EXPERIENCE</span>
          </button>
          <span className="ile-dashboard-status"><i /> LEARNING PORTAL</span>
        </header>

        <section className="game1-main" aria-labelledby="game1-title">
          <div className="game1-intro">
            <div>
              <p className="ile-eyebrow"><span /> PDCA CYCLE / MINI GAME 01</p>
              <h1 id="game1-title">Game 1: <strong>Plan</strong></h1>
              <p className="ile-dashboard-description">
                In the PDCA cycle, what does the <strong>P</strong> stand for? Drag the right answer into the puzzle.
              </p>
            </div>
            <div className="game1-score" aria-live="polite">
              <span>{complete ? 'CORRECT ANSWER' : 'ATTEMPTS'}</span>
              <strong>{complete ? '01' : attempts.toString().padStart(2, '0')}</strong>
            </div>
          </div>

          <div className="game1-layout">
            <section className="game1-puzzle-board" aria-label="PDCA puzzle">
              <div className="game1-board-topline">
                <span><i className={complete ? 'is-success' : ''} />{complete ? 'PUZZLE COMPLETE' : 'PDCA / COMPLETE THE MISSING PIECE'}</span>
                <span>QUESTION 01 / 01</span>
              </div>
              <div className="game1-puzzle-content">
                <div className="game1-question">
                  <span className="game1-question-index">01</span>
                  <div>
                    <span className="game1-question-kicker">YOUR QUESTION</span>
                    <h2>In the PDCA cycle, what does <strong>P</strong> stand for?</h2>
                  </div>
                </div>

                <div className="game1-cycle-card">
                  <span className="game1-cycle-kicker">THE CONTINUOUS IMPROVEMENT CYCLE</span>
                  <div className="game1-cycle-pieces" aria-label="Plan, Do, Check, Act">
                    <div className="game1-hole-target">
                      <PuzzleHole
                        selectedAnswer={selectedAnswer}
                        complete={complete}
                        asset={pieceAssets.slot}
                        onClick={() => selectedAnswer && submitAnswer(selectedAnswer, true)}
                        isDraggingOver={isDraggingOver}
                      />
                    </div>
                    <span className="game1-cycle-piece"><PuzzlePieceArt className="game1-cycle-piece-art" asset={pieceAssets['cycle-do']} /><b>D</b><small>DO</small></span>
                    <span className="game1-cycle-piece"><PuzzlePieceArt className="game1-cycle-piece-art" asset={pieceAssets['cycle-check']} /><b>C</b><small>CHECK</small></span>
                    <span className="game1-cycle-piece"><PuzzlePieceArt className="game1-cycle-piece-art" asset={pieceAssets['cycle-act']} /><b>A</b><small>ACT</small></span>
                  </div>
                  <p className="game1-cycle-caption">PLAN <i /> DO <i /> CHECK <i /> ACT <i /> REPEAT</p>
                </div>

                <div className="game1-answer-section">
                  <div className="game1-answer-heading">
                    <span>ANSWER PIECES</span>
                    <span>{complete ? 'ANSWER LOCKED IN' : 'DRAG OR SELECT A PIECE'}</span>
                  </div>
                  <div className="game1-answer-pieces">
                    {answers.map((answer, index) => !usedAnswers.has(answer) && (
                      <button
                        className={`game1-answer-piece${selectedAnswer === answer ? ' is-selected' : ''}${draggingAnswer === answer ? ' is-dragging' : ''}${complete && answer === 'Plan' ? ' is-correct' : ''}`}
                        key={answer}
                        type="button"
                        disabled={complete}
                        aria-pressed={selectedAnswer === answer}
                        onClick={() => {
                          if (suppressClickRef.current) {
                            suppressClickRef.current = false
                            return
                          }
                          if (complete) return
                          setSelectedAnswer(answer)
                          setFeedback('Now place this piece in the puzzle.')
                        }}
                        onPointerDown={(event) => handleAnswerPointerDown(event, answer)}
                        onPointerMove={handleAnswerPointerMove}
                        onPointerUp={handleAnswerPointerUp}
                        onPointerCancel={() => {
                          draggingAnswerRef.current = null
                          setDraggingAnswer(null)
                          setDragPoint(null)
                          setIsDraggingOver(false)
                        }}
                      >
                        <PuzzlePieceArt className="game1-answer-piece-art" asset={pieceAssets[`answer-${answer.toLowerCase()}` as PieceId]} />
                        <span className="game1-answer-letter">{answer.charAt(0)}</span>
                        <span className="game1-answer-name">{answer}</span>
                        <span className="game1-answer-index">0{index + 1}</span>
                      </button>
                    ))}
                  </div>
                  <div className={`game1-feedback${complete ? ' is-success' : feedback && !feedback.startsWith('Now') ? ' is-error' : ''}`} aria-live="polite">
                    <span aria-hidden="true">{complete ? '✓' : feedback && !feedback.startsWith('Now') ? '!' : 'i'}</span>
                    {feedback || 'Tip: P is the first step in the improvement cycle.'}
                  </div>
                </div>
              </div>
            </section>

            <aside className="game1-panel">
              <div className="game1-panel-heading">
                <span className="game1-step">P</span>
                <div><span className="game1-panel-kicker">PDCA / PHASE 01</span><h2>Plan the answer.</h2></div>
              </div>
              <p className="game1-panel-copy">Complete the cycle by placing the right answer in the missing puzzle piece. <strong>P</strong> is where every improvement begins.</p>

              <div className="game1-instructions">
                <div><span>01</span><p><strong>Choose</strong> an answer piece</p></div>
                <div><span>02</span><p><strong>Drag</strong> it into the puzzle</p></div>
                <div><span>03</span><p><strong>Complete</strong> the PDCA cycle</p></div>
              </div>

              <div className="game1-pdca" aria-label="PDCA phases">
                <span className="is-active"><b>P</b> Plan</span>
                <span><b>D</b> Do</span>
                <span><b>C</b> Check</span>
                <span><b>A</b> Act</span>
              </div>

              <div className="game1-stats">
                <div><span>ATTEMPTS</span><strong>{attempts.toString().padStart(2, '0')}</strong></div>
                <div><span>STATUS</span><strong className="game1-status-value">{complete ? 'DONE' : 'PLAY'}</strong></div>
              </div>

              <button className="game1-reset" type="button" onClick={resetGame}>
                <span aria-hidden="true">↻</span> Start over
              </button>
            </aside>
          </div>
          <p className="game1-footer"><span>LEARN BY PLAYING</span><span>PLAN · DO · CHECK · ACT</span></p>
        </section>
      </div>
      {draggingAnswer && dragPoint && createPortal(
        <div
          className="game1-drag-preview"
          style={{ left: dragPoint.x, top: dragPoint.y }}
          aria-hidden="true"
        >
          <PuzzlePieceArt className="game1-drag-preview-art" asset={pieceAssets[`answer-${draggingAnswer.toLowerCase()}` as PieceId]} />
          <span className="game1-answer-letter">{draggingAnswer.charAt(0)}</span>
          <span className="game1-answer-name">{draggingAnswer}</span>
        </div>,
        document.body,
      )}
    </main>
  )
}
