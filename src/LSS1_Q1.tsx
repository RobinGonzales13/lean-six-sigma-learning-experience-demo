import { useState, type CSSProperties } from 'react'
import { TrainingShell } from './LSS1_2'

const quizOptions = [
  'Reduce waste, solve problems, and improve processes.',
  'Focus only on speed and ignore customer value.',
  'Add more steps so every task has extra checks.',
  'Use complex tools before understanding the process.',
]

export default function LSS1Q1Page({
  onBack,
  onSubmit,
}: {
  onBack: () => void
  onSubmit: (selectedOption: number) => void
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [validationMessage, setValidationMessage] = useState('')

  function submitAnswer() {
    if (selectedOption === null) {
      setValidationMessage('Select an answer before submitting.')
      return
    }
    onSubmit(selectedOption)
  }

  return (
    <TrainingShell stage="KNOWLEDGE CHECK / 03">
      <section className="quiz-layout" aria-labelledby="quiz-title">
        <div className="quiz-heading">
          <p className="training-kicker"><span />FINAL CHECK</p>
          <h1 id="quiz-title" className="lesson-title">Put the principles together.</h1>
          <p className="quiz-question">What is the main aim of Lean Six Sigma?</p>
        </div>

        <fieldset className="quiz-options">
          <legend className="visually-hidden">Choose one answer</legend>
          {quizOptions.map((option, index) => (
            <label
              className={`quiz-option${selectedOption === index ? ' is-selected' : ''}`}
              key={option}
              style={{ animationDelay: `${160 + index * 120}ms` } as CSSProperties}
            >
              <input
                type="radio"
                name="lean-six-sigma-answer"
                value={index}
                checked={selectedOption === index}
                onChange={() => setSelectedOption(index)}
              />
              <span className="quiz-option-index">0{index + 1}</span>
              <span className="quiz-option-text">{option}</span>
              <span className="quiz-option-indicator" aria-hidden="true" />
            </label>
          ))}
        </fieldset>

        <footer className="quiz-actions">
          <span className="quiz-note" aria-live="polite">{validationMessage || 'SELECT ONE RESPONSE'}</span>
          <div className="quiz-action-buttons">
            <button className="back-button" type="button" onClick={onBack}>
              <span aria-hidden="true">&lt;</span> Back
            </button>
            <button className="submit-answer-button" type="button" onClick={submitAnswer}>
              Submit answer <span aria-hidden="true">&gt;</span>
            </button>
          </div>
        </footer>
      </section>
      <div className="quiz-endmark"><span />END OF DEMO<span /></div>
    </TrainingShell>
  )
}
