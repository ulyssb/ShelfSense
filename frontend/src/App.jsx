import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import GetStarted from './pages/GetStarted.jsx'
import Recommendations from './pages/Recommendations.jsx'
import ReadingList from './pages/ReadingList.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/reading-list" element={<ReadingList />} />
    </Routes>
  )
}

export default App
