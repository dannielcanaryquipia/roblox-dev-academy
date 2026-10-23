import React, { useState } from 'react'
import { Inline } from '../lib/inline.jsx'

export default function Quiz({ id, questions, progress }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const best = progress.state.quizzes[id]

  const score = questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0)
  const allAnswered = Object.keys(answers).length === questions.length

  const submit = () => {
    setSubmitted(true)
    progress.saveQuiz(id, score, questions.length)
  }
  const retry = () => {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <section className="quiz" aria-label="Check your understanding">
      <header className="quiz-head">
        <h2>Check yourself</h2>
        {best && <span className="quiz-best">Best: {best.best}/{best.total}</span>}
      </header>
      {questions.map((q, i) => (
        <fieldset key={i} className="quiz-q">
          <legend><span className="quiz-n">{i + 1}.</span> <Inline text={q.q} /></legend>
          {q.options.map((opt, j) => {
            const chosen = answers[i] === j
            const correct = submitted && j === q.answer
            const wrong = submitted && chosen && j !== q.answer
            return (
              <label key={j} className={`quiz-opt${chosen ? ' chosen' : ''}${correct ? ' correct' : ''}${wrong ? ' wrong' : ''}`}>
                <input
                  type="radio"
                  name={`${id}-q${i}`}
                  checked={chosen}
                  disabled={submitted}
                  onChange={() => setAnswers((a) => ({ ...a, [i]: j }))}
                />
                <span><Inline text={opt} /></span>
              </label>
            )
          })}
          {submitted && q.why && (
            <p className={`quiz-why ${answers[i] === q.answer ? 'ok' : 'no'}`}>
              {answers[i] === q.answer ? 'Correct. ' : 'Not quite. '}
              <Inline text={q.why} />
            </p>
          )}
        </fieldset>
      ))}
      <div className="quiz-actions">
        {!submitted ? (
          <button type="button" className="btn btn-primary" disabled={!allAnswered} onClick={submit}>
            Check answers
          </button>
        ) : (
          <>
            <p className="quiz-score">
              You got {score} of {questions.length}.
              {score === questions.length ? ' Clean run.' : ' Re-read the parts you missed, then try again.'}
            </p>
            <button type="button" className="btn" onClick={retry}>Try again</button>
          </>
        )}
      </div>
    </section>
  )
}
