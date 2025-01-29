import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import Play from './Components/Play';
import { GameProvider } from "./context";

function Layout() {
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/play" element={<Play />} />
      </Routes>
  )
}

function App() {
  return (
    <>
    <GameProvider>
      <Router>
        <Layout />
      </Router>
    </GameProvider>
    </>
   
  )
}

export default App