import { useState } from 'react'

export default function Leaderboards() {
  const [tab, setTab] = useState<'overview' | 'max' | 'levels'>('overview')

  //NOTE TO NEXT PERSON
  //WE CAN REPLACE NAMES WITH IDS FROM MONGO
  //WE CAN ALSO FETCH ALL THE DATA FROM THE EXERCISE ARRAY IN MONGO
  //WE CAN ALSO ASSIGN A VALUE TO LEVELS TO GET DATA HERE
  const overview = [
    {
      title: 'Time in Gym',
      data: [
        { rank: 1, name: 'Alice', value: '120 hrs' },
        { rank: 2, name: 'Bob', value: '95 hrs' },
        { rank: 3, name: 'Charlie', value: '80 hrs' },
      ]
    },
    {
      title: 'Total Weight Lifted',
      data: [
        { rank: 1, name: 'Bob', value: '50,000 lbs' },
        { rank: 2, name: 'Charlie', value: '48,000 lbs' },
        { rank: 3, name: 'Alice', value: '45,000 lbs' },
      ]
    }
  ]

  const maxLifts = [
    {
      title: 'Bench Press (Max)',
      data: [
        { rank: 1, name: 'Bob', value: '200' },
        { rank: 2, name: 'Alice', value: '180' },
        { rank: 3, name: 'Charlie', value: '160' },
      ]
    },
    {
      title: 'Squat (Max)',
      data: [
        { rank: 1, name: 'Charlie', value: '200' },
        { rank: 2, name: 'Bob', value: '180' },
        { rank: 3, name: 'Alice', value: '160' },
      ]
    },
    {
      title: 'Deadlift (Max)',
      data: [
        { rank: 1, name: 'Charlie', value: '200' },
        { rank: 2, name: 'Bob', value: '180' },
        { rank: 3, name: 'Alice', value: '160' },
      ]
    }
  ]

  const levels = [
    {
      title: 'Chest',
      data: [
        { rank: 1, name: 'Alice', value: 'Platinum' },
        { rank: 2, name: 'Bob', value: 'Gold' },
        { rank: 3, name: 'Charlie', value: 'Silver' },
      ]
    },
    {
      title: 'Back',
      data: [
        { rank: 1, name: 'Bob', value: 'Diamond' },
        { rank: 2, name: 'Alice', value: 'Gold' },
        { rank: 3, name: 'Charlie', value: 'Silver' },
      ]
    },
    {
      title: 'Shoulders',
      data: [
        { rank: 1, name: 'Alice', value: 'Gold' },
        { rank: 2, name: 'Bob', value: 'Silver' },
        { rank: 3, name: 'Charlie', value: 'Bronze' },
      ]
    },
    {
      title: 'Legs',
      data: [
        { rank: 1, name: 'Alice', value: 'Platinum' },
        { rank: 2, name: 'Bob', value: 'Gold' },
        { rank: 3, name: 'Charlie', value: 'Silver' },
      ]
    },
    {
      title: 'Biceps',
      data: [
        { rank: 1, name: 'Charlie', value: 'Platinum' },
        { rank: 2, name: 'Bob', value: 'Gold' },
        { rank: 3, name: 'Alice', value: 'Silver' },
      ]
    },
    {
      title: 'Tricep',
      data: [
      { rank: 1, name: 'Bob', value: 'Diamond' },
        { rank: 2, name: 'Alice', value: 'Silver' },
        { rank: 3, name: 'Charlie', value: 'Bronze' },
      ]
    },
    {
      title: 'Core',
      data: [
        { rank: 1, name: 'Alice', value: 'Platinum' },
        { rank: 2, name: 'Bob', value: 'Gold' },
        { rank: 3, name: 'Charlie', value: 'Silver' },
      ]
    },
  ]

  const active = tab === 'overview' ? overview : tab === 'max' ? maxLifts : levels

  return (
    <section>
      <h1>Leaderboards</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
        Compete with your friends across different metrics
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setTab('overview')}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: 6,
            border: tab === 'overview' ? '2px solid var(--accent-red)' : '1px solid var(--border-color)',
            background: tab === 'overview' ? 'var(--accent-red)' : 'var(--secondary-bg)',
            color: tab === 'overview' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setTab('max')}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: 6,
            border: tab === 'max' ? '2px solid var(--accent-red)' : '1px solid var(--border-color)',
            background: tab === 'max' ? 'var(--accent-red)' : 'var(--secondary-bg)',
            color: tab === 'max' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Max Lifts
        </button>
        <button
          type="button"
          onClick={() => setTab('levels')}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: 6,
            border: tab === 'levels' ? '2px solid var(--accent-red)' : '1px solid var(--border-color)',
            background: tab === 'levels' ? 'var(--accent-red)' : 'var(--secondary-bg)',
            color: tab === 'levels' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Levels
        </button>
      </div>

      <div className="grid">
        {active.map((lb) => (
          <div key={lb.title} className="card">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>{lb.title}</h2>
            <ol style={{ listStyle: 'none', marginLeft: 0, padding: 0 }}>
              {lb.data.map((entry) => (
                <li
                  key={`${lb.title}-${entry.rank}-${entry.name}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.8rem',
                    marginBottom: '0.5rem',
                    backgroundColor: 'var(--tertiary-bg)',
                    borderRadius: '4px',
                    borderLeft: `3px solid ${entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#d1d5db' : '#a78bfa'}`
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    #{entry.rank} {entry.name}
                  </span>
                  <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
                    {entry.value}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}
