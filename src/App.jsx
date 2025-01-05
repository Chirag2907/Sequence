import './App.css'
import Game from './Components/Game'

function App() {
  return (
    <div className='main'>
      <div className='players'>Players</div>
      <Game players={8} />
      <div className='your_cards'>Your Cards</div>
    </div>
  )
}

export default App