import { useState, useEffect } from 'react'
import type { BodyPartName, BodyGraphData } from '../types/body'
import { computeLevel, LEVEL_COLORS } from '../types/body'

interface BodyGraphProps {
  data?: BodyGraphData
  imageUrl: string
  onUpdate?: (updated: BodyGraphData) => void
}

// Label positions for the body diagram (front and back views)
// These are relative percentages of the image dimensions
const LABEL_POSITIONS: Record<BodyPartName, { x: number; y: number }> = {
  Chest: { x: 45, y: 30 },
  Back: { x: 65, y: 28 },
  Core: { x: 48, y: 45 },
  Shoulders: { x: 28, y: 18 },
  Biceps: { x: 18, y: 35 },
  Triceps: { x: 75, y: 38 },
  Legs: { x: 60, y: 72 }
}

const BODY_PARTS: BodyPartName[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core']

export default function BodyGraph({ data = {}, imageUrl, onUpdate }: BodyGraphProps) {
  const [weights, setWeights] = useState<BodyGraphData>(data)

  useEffect(() => {
    setWeights(data)
  }, [data])

  const handleWeightChange = (part: BodyPartName, value: number) => {
    const updated = { ...weights, [part]: value }
    setWeights(updated)
    localStorage.setItem(`bodygraph_${part}`, JSON.stringify(value))
    onUpdate?.(updated)
  }

  return (
    <div style={{ width: '100%', padding: '2rem 0' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: 'var(--secondary-bg)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Body Diagram Image */}
        <div style={{ position: 'relative', width: '100%' }}>
          <img
            src={imageUrl}
            alt="Body Diagram"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto'
            }}
          />

          {/* Level Badges Overlay */}
          {BODY_PARTS.map((part) => {
            const weight = weights[part] ?? 0
            const level = computeLevel(weight)
            const pos = LABEL_POSITIONS[part]
            const color = LEVEL_COLORS[level]

            return (
              <div
                key={part}
                style={{
                  position: 'absolute',
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: color,
                  color: level === 'Gold' || level === 'Diamond' || level === 'Silver' ? '#000' : '#fff',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: '2px solid var(--accent-red)',
                  textAlign: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                  minWidth: '50px'
                }}
              >
                {level}
              </div>
            )
          })}
        </div>
      </div>

      {/* Weight Input Controls */}
      <div
        style={{
          marginTop: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          maxWidth: '600px',
          margin: '2rem auto 0'
        }}
      >
        {BODY_PARTS.map((part) => {
          const weight = weights[part] ?? 0
          const level = computeLevel(weight)
          const color = LEVEL_COLORS[level]

          return (
            <div
              key={part}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--tertiary-bg)',
                borderRadius: '6px',
                borderLeft: `4px solid ${color}`
              }}
            >
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                {part}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => handleWeightChange(part, Math.max(0, Number(e.target.value)))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                  backgroundColor: 'var(--secondary-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontWeight: 600
                }}
              />
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: color,
                  textAlign: 'center'
                }}
              >
                {level}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--secondary-bg)',
          borderRadius: '6px',
          maxWidth: '600px',
          margin: '2rem auto 0',
          textAlign: 'center'
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Total Weight Lifted</h3>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-red)' }}>
          {Object.values(weights).reduce((sum, w) => sum + (w ?? 0), 0).toLocaleString()} kg
        </div>
      </div>
    </div>
  )
}
