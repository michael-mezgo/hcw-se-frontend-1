import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cars from './pages/Cars'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
