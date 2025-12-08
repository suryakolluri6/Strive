import { useState, useEffect } from 'react'
import BodyGraph from '../components/BodyGraph'
import type { BodyGraphData } from '../types/body'

export default function Personal() {
  const [bodyData, setBodyData] = useState<BodyGraphData>({})

  useEffect(() => {
    // Load persisted data from localStorage
    const savedData: BodyGraphData = {}
    const bodyParts: (keyof BodyGraphData)[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core']
    bodyParts.forEach((part) => {
      const saved = localStorage.getItem(`bodygraph_${part as string}`)
      if (saved) {
        savedData[part] = JSON.parse(saved)
      }
    })
    setBodyData(savedData)
  }, [])

  const handleBodyGraphUpdate = (updated: BodyGraphData) => {
    setBodyData(updated)
  }

  return (
    <section>
      <h1>My Stats</h1>

      <div style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h2>Body Levels</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Your strength distribution across different muscle groups
          </p>
          <BodyGraph 
            data={bodyData} 
            imageUrl="/strive-drawing.jpg"
            onUpdate={handleBodyGraphUpdate}
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>Totals</h2>
          <ul style={{ listStyle: 'none', marginLeft: 0 }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.8rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span>Total Time in Gym</span>
              <strong style={{ color: 'var(--accent-red)' }}>123 hrs</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.8rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span>Total Weight Lifted</span>
              <strong style={{ color: 'var(--accent-red)' }}>45,000 kg</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0' }}>
              <span>Personal Best (Bench)</span>
              <strong style={{ color: 'var(--accent-red)' }}>150 kg</strong>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
