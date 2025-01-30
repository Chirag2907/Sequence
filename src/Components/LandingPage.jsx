import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/LandingPage.css';
import { ToastContainer, toast } from 'react-toastify';
import sampleBoard from '../assets/SampleBoard.png';
import { db } from "../Firebaseconfig";
import { BoardMap } from "../BoardMap";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onSnapshot } from 'firebase/firestore';

const LandingPage = () => {
  const [numofPlayers, setNumPlayers] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [userName, setUserName] = useState('');
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isJoinMode, setIsJoinMode] = useState(false);
  const [JoinWaitingMessage, setJoinWaitingMessage] = useState('');
  const [createWaitingMessage, setCreateWaitingMessage] = useState('');
  const [playersJoined, setPlayersJoined] = useState([]);

  const generateDeck = () => {
    const suits = ["H", "D", "C", "S"];
    const ranks = [
      "a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k",
    ];
  
    const deck = [];
    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        deck.push(`${suit}${rank}`);
      });
    });
    return deck;
  };
  
  // Function to shuffle an array
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };
  
  // Generate two shuffled decks
  const generateGameDeck = () => {
    const singleDeck = generateDeck();
    const twoDecks = [...singleDeck, ...singleDeck]; // Combine two decks
    return shuffle(twoDecks);
  };

  const navigate = useNavigate();

  const error = (message) => toast(message);

  const handleCreateGame = async () => {
    if (!userName) {
      error('Please enter your name!');
      return;
    }
    if (!numofPlayers) {
      error('Select number of players to create the game!');
      return;
    }
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGameCode(generatedCode);

    const Players = [
      {
        PlayerName: userName,
        Last_card: "J1",
        Player_deck: [],
        Player_hand: [],
        Card_idx: 0,
      }
    ]

    const DocRef = doc(db, "game", generatedCode);
    const docSnap = await getDoc(DocRef);

    const initial_data = {
      BoardMap: BoardMap,
      Deck: generateGameDeck(),
      Players: Players,
      numPlayers: numofPlayers,
      Turn: 0
    }
    if(!docSnap.exists()){
      await setDoc(DocRef, initial_data);
    }
    else{
      error('Game code already exists!');
      return;
    }

    // Helper function to distribute the deck among players
    const distributeDeck = (deck, numOfPlayers) => {
      const distributedDecks = Array(numOfPlayers).fill().map(() => []);
      
      // Distribute cards equally
      deck.forEach((card, index) => {
          const playerIndex = index % numOfPlayers; // Distribute cards in round-robin fashion
          distributedDecks[playerIndex].push(card);
      });

      return distributedDecks;
    };

    const unsubscribe = onSnapshot(DocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const gameData = snapshot.data();
        const currentPlayers = gameData.Players || [];
  
        // Show waiting screen with player names and game code
        setCreateWaitingMessage(
          `Game Code: ${generatedCode}. Waiting for other players (${currentPlayers.length}/${numofPlayers}).`
        );
        setPlayersJoined(currentPlayers.map((player) => player.PlayerName));
  
        // Navigate to the play screen once all players join
        if (currentPlayers.length === parseInt(numofPlayers)) {
          setCreateWaitingMessage('');
          unsubscribe(); // Stop listening

          const gameDocRef = doc(db, "game", generatedCode);
          
          try {
            // Fetch the deck from Firebase
            const gameDocSnap = await getDoc(gameDocRef);
            
            if (gameDocSnap.exists()) {
              const deck = gameDocSnap.data().Deck;  // Get the shuffled deck
          
              // Distribute cards equally among players
              const distributedDecks = distributeDeck(deck, currentPlayers.length);
          
              // Prepare an array of updated Players data with their respective Player_deck
              const updatedPlayers = currentPlayers.map((player, index) => {
                  // Update the Player_deck for each player
                  return {
                      ...player,
                      Player_deck: distributedDecks[index]  // Assign the distributed deck to the Player_deck field
                  };
              });
          
              // Update the Players field in Firebase with the new Player_deck assignments
              try {
                  await updateDoc(gameDocRef, {
                      Players: updatedPlayers // Update the entire Players array with the updated decks
                  });
                  console.log('Players\' decks distributed and saved in Firebase');
          
                  // Navigate to the game page
                  navigate(`/play?mode=create&players=${numofPlayers}&code=${generatedCode}&name=${userName}`);
              } catch (error) {
                  console.error('Error updating Players with distributed decks in Firebase:', error);
              }
          }
        } catch (error) {
            console.error('Error fetching deck or distributing cards:', error);
        }
          

          navigate(`/play?mode=create&players=${numofPlayers}&code=${generatedCode}&name=${userName}`);
        }
      }
    });
  };

  const handleJoinGame = async () => {
    if (!userName) {
      error("Please enter your name!");
      return;
    }
    if (!gameCode) {
      error("Enter the game code to join the game!");
      return;
    }
  
    const DocRef = doc(db, "game", gameCode);
  
    // Check if the game code exists
    const docSnap = await getDoc(DocRef);
  
    if (!docSnap.exists()) {
      error("Game code does not exist!");
      return;
    }
  
    // Check and update players
    const gameData = docSnap.data();
    const updatedPlayers = gameData.Players || [];
    
    if (updatedPlayers.find((player) => player.PlayerName === userName)) {
      error("Player name already exists in the game!");
      return;
    }
  
    if (updatedPlayers.length >= parseInt(gameData.numPlayers)) {
      error("The game is full!");
      return;
    }
  
    updatedPlayers.push({
      PlayerName: userName,
      Last_card: "J1",
      Player_deck: [],
      Player_hand: [],
      Card_idx: 0,
    });
  
    await updateDoc(DocRef, { Players: updatedPlayers });
    toast(`${userName} joined the game. Waiting for other players.`);
  
    // Real-time listener for the game document
    const unsubscribe = onSnapshot(DocRef, (snapshot) => {
      if (snapshot.exists()) {
        const updatedGameData = snapshot.data();
        const currentPlayers = updatedGameData.Players || [];
  
        // Check if all players have joined
        if (currentPlayers.length === parseInt(updatedGameData.numPlayers)) {
          setJoinWaitingMessage(''); // Clear the waiting message
          unsubscribe(); // Stop listening once the game is ready to start
          navigate(`/play?mode=join&code=${gameCode}&name=${userName}`);
        } else {
          // Update the waiting message
          setJoinWaitingMessage(
            `${userName} joined the game. Waiting for other players (${currentPlayers.length}/${updatedGameData.numPlayers}).`
          );
        }
      }
    });
  };

  return (
    <div className="landing-page">
      <img src={sampleBoard} alt="sample board" className="sample-board-1" />
      <img src={sampleBoard} alt="sample board" className="sample-board-2" />

      <ToastContainer />


      <div className='on_top'>
    
      <div className="landing-title">Let&apos;s Play</div>
      <div className="landing-sequence">SEQUENCE</div>

      {!isCreateMode && !isJoinMode && (
        <div className="landing-buttons">
          <button onClick={() => setIsCreateMode(true)}>Create Game</button>
          <button onClick={() => setIsJoinMode(true)}>Join Game</button>
        </div>
      )}

      {isCreateMode && (
        <div className="create-game-section">
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="game-code-input"
          />
          <select
            value={numofPlayers}
            onChange={(e) => setNumPlayers(e.target.value)}
            className="player-select"
          >
            <option value="">Select Players</option>
            <option value="2">2 Players</option>
            <option value="3">3 Players</option>
            <option value="4">4 Players</option>
            <option value="6">6 Players</option>
            <option value="8">8 Players</option>
            <option value="9">9 Players</option>
            <option value="10">10 Players</option>
            <option value="12">12 Players</option>
          </select>
          <button onClick={handleCreateGame} className="start-game-btn">Create Game</button>
        </div>
      )}

      {isCreateMode && createWaitingMessage && (
        <div className="waiting-screen">
          <div className="game-code-section">
            <p>Game Code: <strong>{gameCode}</strong></p>
            <button
              onClick={() => navigator.clipboard.writeText(gameCode)}
              className="copy-code-btn"
            >
              Copy Game Code
            </button>
          </div>
          <div className="players-joined-section">
            <h4>Players Joined:</h4>
              {playersJoined.map((player, index) => (
                <div key={index}>{player}</div>
              ))}
          </div>
          <div className="waiting-message">{createWaitingMessage}</div>
        </div>
      )}

      {isJoinMode && (
        <div className="join-game-section">
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="game-code-input"
          />
          <input
            type="text"
            placeholder="Enter Game Code"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            className="game-code-input"
          />
          <button onClick={handleJoinGame} className="join-game-btn">Join Game</button>
          {JoinWaitingMessage && (
          <div className="waiting-message">
            {JoinWaitingMessage}
          </div>
)}
        </div>
      )}
    </div>
    </div>
  );
};

export default LandingPage;