import { useState } from 'react'
import { submitStats } from '../services/api'

// Exercise database organized by body part
const EXERCISES_BY_BODYPART = {
  Chest: [
    'Bench Press',
    'Incline Bench Press',
    'Dumbbell Press',
    'Cable Fly',
    'Push-ups',
    'Chest Dips'
  ],
  Back: [
    'Deadlift',
    'Bent Over Rows',
    'Pull-ups',
    'Lat Pulldowns',
    'T-Bar Rows',
    'Seated Rows'
  ],
  Legs: [
    'Squats',
    'Leg Press',
    'Leg Curls',
    'Leg Extensions',
    'Lunges',
    'Calf Raises'
  ],
  Shoulders: [
    'Military Press',
    'Lateral Raises',
    'Shoulder Shrugs',
    'Overhead Press',
    'Reverse Fly',
    'Front Raises'
  ],
  Biceps: [
    'Barbell Curls',
    'Dumbbell Curls',
    'Hammer Curls',
    'Cable Curls',
    'Preacher Curls',
    'Machine Curls'
  ],
  Triceps: [
    'Tricep Dips',
    'Tricep Pushdowns',
    'Overhead Tricep Extension',
    'Skull Crushers',
    'Close Grip Bench Press',
    'Rope Pushdowns'
  ],
  Core: [
    'Planks',
    'Ab Crunches',
    'Cable Crunches',
    'Hanging Leg Raises',
    'Woodchops',
    'Russian Twists'
  ]
}

interface Exercise {
  id: string
  bodyPart: string
  exercise: string
  sets: number
  reps: number
  weight: number
}

export default function SubmitStats() {
  const [sessionTime, setSessionTime] = useState(60) // minutes
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('Chest')
  const [currentExercise, setCurrentExercise] = useState({
    exercise: EXERCISES_BY_BODYPART.Chest[0],
    sets: 3,
    reps: 10,
    weight: 100
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // When body part changes, reset exercise to first in that category
  const handleBodyPartChange = (bodyPart: string) => {
    setSelectedBodyPart(bodyPart)
    setCurrentExercise({
      ...currentExercise,
      exercise: EXERCISES_BY_BODYPART[bodyPart as keyof typeof EXERCISES_BY_BODYPART][0]
    })
  }

  // Add exercise to session
  const addExercise = () => {
    const newExercise: Exercise = {
      id: Math.random().toString(),
      bodyPart: selectedBodyPart,
      ...currentExercise
    }
    setExercises([...exercises, newExercise])
    // Reset form
    setCurrentExercise({
      exercise: EXERCISES_BY_BODYPART.Chest[0],
      sets: 3,
      reps: 10,
      weight: 100
    })
    setSelectedBodyPart('Chest')
  }

  // Remove exercise from session
  const removeExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id))
  }

  // Calculate totals
  const totalWeight = exercises.reduce((sum, ex) => sum + (ex.weight * ex.sets * ex.reps), 0)
  const bodyPartSummary = Object.keys(EXERCISES_BY_BODYPART).map(bp => ({
    bodyPart: bp,
    weight: exercises
      .filter(e => e.bodyPart === bp)
      .reduce((sum, e) => sum + (e.weight * e.sets * e.reps), 0)
  }))

  // Submit session
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (exercises.length === 0) {
      setMsg('✗ Please add at least one exercise')
      return
    }
    setLoading(true)
    setMsg(null)
    try {
      const sessionData = {
        sessionTime,
        exercises,
        totalWeight,
        timestamp: new Date().toISOString()
      }
      
      // Save to localStorage
      const sessions = JSON.parse(localStorage.getItem('workoutSessions') || '[]')
      sessions.push(sessionData)
      localStorage.setItem('workoutSessions', JSON.stringify(sessions))
      
      // Try to submit to backend (optional)
      try {
        await submitStats(sessionData)
      } catch {
        // If backend fails, we still have localStorage saved
      }
      
      setMsg('✓ Workout saved successfully!')
      setExercises([])
      setSessionTime(60)
    } catch (err) {
      setMsg('✗ Error saving workout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h1>Log Your Workout</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Track your gym session by logging exercises and calculating your totals
      </p>

      <form onSubmit={onSubmit}>
        {/* Session Time */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Session Overview</h2>
          <div className="form-group">
            <label htmlFor="sessionTime">Time in Gym (minutes)</label>
            <input
              id="sessionTime"
              type="number"
              value={sessionTime}
              onChange={(e) => setSessionTime(Number(e.target.value))}
              min="1"
            />
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--tertiary-bg)',
            borderRadius: '6px',
            marginTop: '1rem'
          }}>
            <p style={{ margin: 0, marginBottom: '0.5rem' }}>
              <strong>Total Session Time:</strong> {sessionTime} minutes
            </p>
            <p style={{ margin: 0 }}>
              <strong>Exercises Logged:</strong> {exercises.length}
            </p>
          </div>
        </div>

        {/* Add Exercise */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Add Exercise</h2>

          <div className="form-group">
            <label>Body Part</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
              {Object.keys(EXERCISES_BY_BODYPART).map(bp => (
                <button
                  key={bp}
                  type="button"
                  onClick={() => handleBodyPartChange(bp)}
                  style={{
                    backgroundColor: selectedBodyPart === bp ? 'var(--accent-red)' : 'var(--secondary-bg)',
                    color: selectedBodyPart === bp ? 'white' : 'var(--text-secondary)',
                    border: `2px solid ${selectedBodyPart === bp ? 'var(--accent-red)' : 'var(--border-color)'}`,
                    padding: '0.6rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    fontWeight: 600
                  }}
                >
                  {bp}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="exercise">Exercise</label>
            <select
              id="exercise"
              value={currentExercise.exercise}
              onChange={(e) => setCurrentExercise({ ...currentExercise, exercise: e.target.value })}
            >
              {EXERCISES_BY_BODYPART[selectedBodyPart as keyof typeof EXERCISES_BY_BODYPART].map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="sets">Sets</label>
              <input
                id="sets"
                type="number"
                value={currentExercise.sets}
                onChange={(e) => setCurrentExercise({ ...currentExercise, sets: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reps">Reps</label>
              <input
                id="reps"
                type="number"
                value={currentExercise.reps}
                onChange={(e) => setCurrentExercise({ ...currentExercise, reps: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (lb)</label>
              <input
                id="weight"
                type="number"
                value={currentExercise.weight}
                onChange={(e) => setCurrentExercise({ ...currentExercise, weight: Number(e.target.value) })}
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <button type="button" onClick={addExercise} style={{ width: '100%', marginTop: '1rem' }}>
            + Add Exercise to Session
          </button>
        </div>

        {/* Exercises in Session */}
        {exercises.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2>Exercises in Session</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ textAlign: 'left', padding: '0.8rem', fontWeight: 600 }}>Body Part</th>
                    <th style={{ textAlign: 'left', padding: '0.8rem', fontWeight: 600 }}>Exercise</th>
                    <th style={{ textAlign: 'center', padding: '0.8rem', fontWeight: 600 }}>Sets</th>
                    <th style={{ textAlign: 'center', padding: '0.8rem', fontWeight: 600 }}>Reps</th>
                    <th style={{ textAlign: 'center', padding: '0.8rem', fontWeight: 600 }}>Weight (lb)</th>
                    <th style={{ textAlign: 'center', padding: '0.8rem', fontWeight: 600 }}>Total (lb)</th>
                    <th style={{ textAlign: 'center', padding: '0.8rem', fontWeight: 600 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {exercises.map(ex => (
                    <tr key={ex.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.8rem' }}>{ex.bodyPart}</td>
                      <td style={{ padding: '0.8rem' }}>{ex.exercise}</td>
                      <td style={{ textAlign: 'center', padding: '0.8rem' }}>{ex.sets}</td>
                      <td style={{ textAlign: 'center', padding: '0.8rem' }}>{ex.reps}</td>
                      <td style={{ textAlign: 'center', padding: '0.8rem' }}>{ex.weight}</td>
                      <td style={{ textAlign: 'center', padding: '0.8rem', color: 'var(--accent-red)', fontWeight: 600 }}>
                        {ex.weight * ex.sets * ex.reps}
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.8rem' }}>
                        <button
                          type="button"
                          onClick={() => removeExercise(ex.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--accent-red)',
                            color: 'var(--accent-red)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary by Body Part */}
        {exercises.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2>Summary by Body Part</h2>
            <div className="grid">
              {bodyPartSummary.map(bp => bp.weight > 0 && (
                <div key={bp.bodyPart} style={{
                  padding: '1rem',
                  backgroundColor: 'var(--tertiary-bg)',
                  borderRadius: '6px',
                  textAlign: 'center',
                  border: `2px solid var(--border-color)`
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>{bp.bodyPart}</p>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                    {bp.weight} lb
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Summary */}
        {exercises.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'var(--tertiary-bg)', border: '2px solid var(--accent-red)' }}>
            <h2 style={{ marginBottom: '1rem' }}>Session Totals</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Total Weight Lifted</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                  {totalWeight} lbs
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Total Exercises</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                  {exercises.length}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Session Duration</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                  {sessionTime} min
                </p>
              </div>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading || exercises.length === 0} style={{ width: '100%' }}>
          {loading ? 'Saving...' : 'Save Workout Session'}
        </button>

        {msg && (
          <div style={{
            marginTop: '1rem',
            padding: '0.8rem',
            borderRadius: '6px',
            backgroundColor: msg.includes('successfully') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: msg.includes('successfully') ? '#22c55e' : '#ef4444',
            border: `1px solid ${msg.includes('successfully') ? '#22c55e' : '#ef4444'}`,
            textAlign: 'center'
          }}>
            {msg}
          </div>
        )}
      </form>
    </section>
  )
}
