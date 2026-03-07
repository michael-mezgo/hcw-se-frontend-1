import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cars from './pages/Cars'
import SingleCar from "./pages/SingleCar";
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<SingleCar />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
