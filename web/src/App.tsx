import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { RedirectPage } from './pages/Redirect'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:shortUrl" element={<RedirectPage />} />
        <Route path="/not-found" element={<NotFound />} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}