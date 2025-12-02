import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Personal from './pages/Personal'
import Leaderboards from './pages/Leaderboards'
import SubmitStats from './pages/SubmitStats'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/me" element={<Personal />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/submit" element={<SubmitStats />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
