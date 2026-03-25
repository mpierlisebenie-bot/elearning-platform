import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Components/Login'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<div>Page Register (à créer)</div>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App