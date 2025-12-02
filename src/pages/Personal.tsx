import { useEffect, useState } from 'react'
import BodyDiagram from '../components/BodyDiagram'
import { getHealth } from '../services/api'

export default function Personal(){
  const [status, setStatus] = useState<string | null>(null)

  useEffect(()=>{
    getHealth()
      .then((d: {status: string}) => setStatus(d.status))
      .catch(()=>setStatus('unreachable'))
  },[])

  return (
    <section style={{padding:20}}>
      <h1>My Stats</h1>
      <p>API status: {status ?? 'loading...'}</p>

      <div style={{display:'flex',gap:20,marginTop:20}}>
        <div style={{flex:1}}>
          <h2>Body Levels</h2>
          <BodyDiagram />
        </div>
        <div style={{flex:1}}>
          <h2>Totals</h2>
          <ul>
            <li>Total time: 123 hrs</li>
            <li>Total weight lifted: 45,000 kg</li>
            <li>Top lifts: Bench 150kg</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
