import * as deck from '@letele/playing-cards';
import '../Styles/Game.css';
import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import red_token from '../assets/Red_Token.png';
import blue_token from '../assets/Blue_Token.png';
import green_token from '../assets/Green_Token.png';
import empty_token from '../assets/Empty.png';
import { ToastContainer, toast } from 'react-toastify';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from "../Firebaseconfig";
import { sequence_board } from '../sequence_board';
import { GameContext } from '../context'; // Import the GameContext

const Game = (props) => {
  const [NumPlayers, setNumPlayers] = useState(0);
  const [Turn, setTurn] = useState(0);
  const [PlayerData, setPlayerData] = useState([]);
  const [BoardMap, setBoardMap] = useState({});
  const { selectedCard, setSelectedCard } = useContext(GameContext); // Access context

  const teams = NumPlayers % 3 === 0 ? 3 : 2;
  const colors = ['red', 'blue', 'green'];

  const win = (color) => toast(`${color} Team Wins!`);

  const HandleCellClick = async (cell) => {

    const cardName = cell.split('-')[0]
    const currentPlayer = PlayerData[Turn % NumPlayers]?.PlayerName;

    if(cardName=="J1"){
      return;
    }
    
    if (props.playername !== currentPlayer) {
      toast.warn("It's not your turn!");
      return;
    }

    if (!selectedCard) {
      toast.warn("No card selected! Please select a card first!");
      return;
    }
  
    let color = colors[Turn % teams];

    // logic for jacks

    if(selectedCard == "Dj" || selectedCard == "Cj"){
      if (BoardMap[cell]) {
        toast.warn("This cell is already occupied!");
        return;
      }
    }
    else if(selectedCard == "Hj" || selectedCard == "Sj"){
      if(!BoardMap[cell] || BoardMap[cell] == color) {
        toast.warn("You cannot use this card on this cell!");
        return;
      }
      else{
        color = "none";
      }
    }
    else{
      if (BoardMap[cell]) {
        toast.warn("This cell is already occupied!");
        return;
      }
      if(cardName != selectedCard){
        toast.warn("Click on the card you selected!");
        return;
      }
    }
  

    // Prepare updated board state
    const updatedBoardMap = { ...BoardMap, [cell]: color };
  
    // Update player's hand and turn
    const updatedPlayerData = PlayerData.map((player) => {
      if (player.PlayerName === props.playername) {
        const updatedHand = player.Player_hand.filter((card) => card !== selectedCard);
        if (player.Card_idx < player.Player_deck.length) {
          updatedHand.push(player.Player_deck[player.Card_idx]);
          player.Card_idx += 1;
        }
        return {
          ...player,
          Player_hand: updatedHand,
          Last_card: selectedCard,
        };
      }
      return player;
    });
  
    const nextTurn = Turn + 1;
  
    // Push updates to Firestore atomically
    try {
      const gameDocRef = doc(db, "game", props.code);
  
      await updateDoc(gameDocRef, {
        BoardMap: updatedBoardMap,
        Turn: nextTurn, // Atomic update of Turn
        Players: updatedPlayerData,
      });
  
      setSelectedCard(null); // Reset selected card
  
      if (WinCheck(color, updatedBoardMap)) {
        win(color);
        updateDoc(gameDocRef, { Deck: [color] });
      }
    } catch (error) {
      console.error("Error updating game state:", error);
      toast.error("Failed to update game state.");
    }
  };

  const WinCheck = (color, board) => {
    // Win condition logic remains the same
    // Check rows, columns, diagonals, and anti-diagonals for sequences of 5
    for (let i = 0; i < 10; i++) {
      let count = 0;
      for (let j = 0; j < 10; j++) {
        if (sequence_board[i][j] === 'J1') {
          count++;
        } else if (board[sequence_board[i][j]] === color) {
          count++;
        } else {
          count = 0;
        }
        if (count === 5) return true;
      }
    }

    for (let i = 0; i < 10; i++) {
      let count = 0;
      for (let j = 0; j < 10; j++) {
        if (sequence_board[j][i] === 'J1') {
          count++;
        } else if (board[sequence_board[j][i]] === color) {
          count++;
        } else {
          count = 0;
        }
        if (count === 5) return true;
      }
    }

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        let count = 0;
        for (let k = 0; k < 5; k++) {
          if (sequence_board[i + k][j + k] === 'J1') {
            count++;
          } else if (board[sequence_board[i + k][j + k]] === color) {
            count++;
          } else {
            count = 0;
          }
          if (count === 5) return true;
        }
      }
    }

    for (let i = 0; i < 6; i++) {
      for (let j = 4; j < 10; j++) {
        let count = 0;
        for (let k = 0; k < 5; k++) {
          if (sequence_board[i + k][j - k] === 'J1') {
            count++;
          } else if (board[sequence_board[i + k][j - k]] === color) {
            count++;
          } else {
            count = 0;
          }
          if (count === 5) return true;
        }
      }
    }

    return false;
  };

  useEffect(() => {
    const gameDocRef = doc(db, 'game', props.code);
    const unsubscribe = onSnapshot(gameDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data();
        setBoardMap(gameData.BoardMap);
        setTurn(gameData.Turn);
        setNumPlayers(gameData.numPlayers)
        setPlayerData(gameData.Players || []);
      } else {
        console.error('Game document does not exist');
      }
    });

    return () => unsubscribe();
  }, [props.code]);

  

  return (
    <div>
      <ToastContainer />
      <div className="board">
        <div className="heading1">SEQUENCE</div>

        <div className="grids">
          <div className="token_grid">
            {sequence_board.map((row, rowIndex) => (
              <div key={rowIndex} className="token-row">
                {row.map((cell, cellIndex) => {
                  const cellColor = BoardMap[cell];
                  const tokenImage =
                    cellColor === 'red'
                      ? red_token
                      : cellColor === 'blue'
                      ? blue_token
                      : cellColor === 'green'
                      ? green_token
                      : empty_token;

                  return (
                    <img
                      key={`${rowIndex}-${cellIndex}`}
                      src={tokenImage}
                      alt="token"
                      className="token"
                      onClick={() => HandleCellClick(cell)}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="cards">
            {sequence_board.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, cellIndex) => {
                  const cardName = cell.split('-')[0];
                  const CardComponent = deck[cardName];

                  return (
                    <CardComponent
                      key={`${rowIndex}-${cellIndex}`}
                      className="one_card"
                      style={{ height: '100%', width: '100%' }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="heading2">SEQUENCE</div>
      </div>
    </div>
  );
};

Game.propTypes = {
  players: PropTypes.number.isRequired,
  code: PropTypes.string.isRequired,
  playername: PropTypes.string.isRequired,
};

export default Game;