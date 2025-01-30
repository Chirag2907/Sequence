import * as deck from "@letele/playing-cards";
import "./../Styles/Game.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import red_token from "../assets/Red_Token.png";
import blue_token from "../assets/Blue_Token.png";
import green_token from "../assets/Green_Token.png";
import empty_token from "../assets/Empty.png";
import { ToastContainer, toast } from "react-toastify";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { db } from "../Firebaseconfig";

const Game = ({ players }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userName = queryParams.get("name");
  const gameCode = queryParams.get("code");

  const teams = players % 3 == 0 ? 3 : 2;

  const [Index, setIndex] = useState(0);

  const colors = ["red", "blue", "green"];

  const sequence_board = {
    index: 1,
    board: [
      [
        { card: "J1", color: "none" },
        { card: "C6_1", color: "none" },
        { card: "C7_2", color: "none" },
        { card: "C8_2", color: "none" },
        { card: "C9_1", color: "none" },
        { card: "C10_1", color: "none" },
        { card: "Cq_2", color: "none" },
        { card: "Ck_2", color: "none" },
        { card: "Ca_2", color: "none" },
        { card: "J1", color: "none" },
      ],
      [
        { card: "S2_1", color: "none" },
        { card: "C5_1", color: "none" },
        { card: "Sa_1", color: "none" },
        { card: "Sk_1", color: "none" },
        { card: "Sq_2", color: "none" },
        { card: "S10_2", color: "none" },
        { card: "S9_2", color: "none" },
        { card: "S8_2", color: "none" },
        { card: "S7_2", color: "none" },
        { card: "Da_2", color: "none" },
      ],
      [
        { card: "S3_1", color: "none" },
        { card: "C4_1", color: "none" },
        { card: "D2_1", color: "none" },
        { card: "C6_2", color: "none" },
        { card: "C7_1", color: "none" },
        { card: "C8_1", color: "none" },
        { card: "C9_2", color: "none" },
        { card: "C10_2", color: "none" },
        { card: "S6_2", color: "none" },
        { card: "Dk_2", color: "none" },
      ],
      [
        { card: "S4_1", color: "none" },
        { card: "C3_1", color: "none" },
        { card: "D3_1", color: "none" },
        { card: "C5_2", color: "none" },
        { card: "H6_1", color: "none" },
        { card: "H7_2", color: "none" },
        { card: "H8_2", color: "none" },
        { card: "Cq_1", color: "none" },
        { card: "S5_2", color: "none" },
        { card: "Dq_1", color: "none" },
      ],
      [
        { card: "S5_1", color: "none" },
        { card: "C2_1", color: "none" },
        { card: "D4_1", color: "none" },
        { card: "C4_2", color: "none" },
        { card: "H5_1", color: "none" },
        { card: "H2_1", color: "none" },
        { card: "H9_2", color: "none" },
        { card: "Ck_1", color: "none" },
        { card: "S4_2", color: "none" },
        { card: "D10_2", color: "none" },
      ],
      [
        { card: "S6_1", color: "none" },
        { card: "Ha_1", color: "none" },
        { card: "D5_1", color: "none" },
        { card: "C3_2", color: "none" },
        { card: "H4_1", color: "none" },
        { card: "H3_1", color: "none" },
        { card: "H10_2", color: "none" },
        { card: "Ca_1", color: "none" },
        { card: "S3_2", color: "none" },
        { card: "D9_2", color: "none" },
      ],
      [
        { card: "S7_1", color: "none" },
        { card: "Hk_1", color: "none" },
        { card: "D6_1", color: "none" },
        { card: "C2_2", color: "none" },
        { card: "Ha_2", color: "none" },
        { card: "Hk_2", color: "none" },
        { card: "Hq_2", color: "none" },
        { card: "Da_1", color: "none" },
        { card: "S2_2", color: "none" },
        { card: "D8_2", color: "none" },
      ],
      [
        { card: "S8_1", color: "none" },
        { card: "Hq_1", color: "none" },
        { card: "D7_1", color: "none" },
        { card: "D8_1", color: "none" },
        { card: "D9_1", color: "none" },
        { card: "D10_1", color: "none" },
        { card: "Dq_2", color: "none" },
        { card: "Dk_1", color: "none" },
        { card: "H2_2", color: "none" },
        { card: "D7_2", color: "none" },
      ],
      [
        { card: "S9_1", color: "none" },
        { card: "H10_1", color: "none" },
        { card: "H9_1", color: "none" },
        { card: "H8_1", color: "none" },
        { card: "H7_1", color: "none" },
        { card: "H6_2", color: "none" },
        { card: "H5_2", color: "none" },
        { card: "H4_2", color: "none" },
        { card: "H3_2", color: "none" },
        { card: "D6_2", color: "none" },
      ],
      [
        { card: "J1", color: "none" },
        { card: "S10_1", color: "none" },
        { card: "Sq_1", color: "none" },
        { card: "Sk_2", color: "none" },
        { card: "Sa_2", color: "none" },
        { card: "D2_2", color: "none" },
        { card: "D3_2", color: "none" },
        { card: "D4_2", color: "none" },
        { card: "D5_2", color: "none" },
        { card: "J1", color: "none" },
      ],
    ],
  };

  const boardMap = {
    C6_1: "none",
    C7_2: "none",
    C8_2: "none",
    C9_1: "none",
    C10_1: "none",
    Cq_2: "none",
    Ck_2: "none",
    Ca_2: "none",
    S2_1: "none",
    C5_1: "none",
    Sa_1: "none",
    Sk_1: "none",
    Sq_2: "none",
    S10_2: "none",
    S9_2: "none",
    S8_2: "none",
    S7_2: "none",
    Da_2: "none",
    S3_1: "none",
    C4_1: "none",
    D2_1: "none",
    C6_2: "none",
    C7_1: "none",
    C8_1: "none",
    C9_2: "none",
    C10_2: "none",
    S6_2: "none",
    Dk_2: "none",
    S4_1: "none",
    C3_1: "none",
    D3_1: "none",
    C5_2: "none",
    H6_1: "none",
    H7_2: "none",
    H8_2: "none",
    Cq_1: "none",
    S5_2: "none",
    Dq_1: "none",
    S5_1: "none",
    C2_1: "none",
    D4_1: "none",
    C4_2: "none",
    H5_1: "none",
    H2_1: "none",
    H9_2: "none",
    Ck_1: "none",
    S4_2: "none",
    D10_2: "none",
    S6_1: "none",
    Ha_1: "none",
    D5_1: "none",
    C3_2: "none",
    H4_1: "none",
    H3_1: "none",
    H10_2: "none",
    Ca_1: "none",
    S3_2: "none",
    D9_2: "none",
    S7_1: "none",
    Hk_1: "none",
    D6_1: "none",
    C2_2: "none",
    Ha_2: "none",
    Hk_2: "none",
    Hq_2: "none",
    Da_1: "none",
    S2_2: "none",
    D8_2: "none",
    S8_1: "none",
    Hq_1: "none",
    D7_1: "none",
    D8_1: "none",
    D9_1: "none",
    D10_1: "none",
    Dq_2: "none",
    Dk_1: "none",
    H2_2: "none",
    D7_2: "none",
    S9_1: "none",
    H10_1: "none",
    H9_1: "none",
    H8_1: "none",
    H7_1: "none",
    H6_2: "none",
    H5_2: "none",
    H4_2: "none",
    H3_2: "none",
    D6_2: "none",
    S10_1: "none",
    Sq_1: "none",
    Sk_2: "none",
    Sa_2: "none",
    D2_2: "none",
    D3_2: "none",
    D4_2: "none",
    D5_2: "none",
  };

  const [BoardMap, setBoardMap] = useState(boardMap);

  const addPlayer = async (_userName) => {
    try {
      const docRef = doc(db, "game", gameCode);
      const docSnap = await getDoc(docRef);

      // Define the initial data structure for the game document
      const initialData = {
        board: BoardMap, // Mapping of strings
        index: 0, // Number
        players: [
          {
            playerName: _userName, // Add player's name
            lastPlayed: "none", // Placeholder string for lastPlayed
          },
        ],
        metadata: {
          numberOfPlayers: 1, // Initial player count
          readyToPlay: false, // Indicates if the game is ready to start
        },
      };

      if (!docSnap.exists()) {
        // Create the document with the initial structure
        await setDoc(docRef, initialData);
        console.log("Document created with initial data structure.");
      } else {
        // Retrieve existing players and metadata
        const existingPlayers = docSnap.data().players || [];
        const existingMetadata = docSnap.data().metadata || {};

        // Update players array by adding a new player
        const updatedPlayers = [
          ...existingPlayers,
          {
            playerName: _userName,
            lastPlayed: "none", // New player starts with this value
          },
        ];

        // Update metadata
        const updatedMetadata = {
          numberOfPlayers: updatedPlayers.length,
          readyToPlay: existingMetadata.readyToPlay || false, // Preserve existing state
        };

        // Update the document
        await updateDoc(docRef, {
          players: updatedPlayers,
          metadata: updatedMetadata,
          board: BoardMap,
        });
        console.log("Document updated successfully.");
      }
    } catch (error) {
      console.log(`Got error: ${error}`);
    }
  };

  const [Board, setBoard] = useState(sequence_board);

  const win = (color) => toast(`${color} Team Wins!`);

  const WinCheck = (color, neww) => {
    const newBoard = neww.board;
    // check rows
    for (let i = 0; i < 10; i++) {
      let count = 0;
      for (let j = 0; j < 10; j++) {
        if (newBoard[i][j].card == "J1") count++;
        else if (newBoard[i][j].color === color) {
          count++;
        } else {
          count = 0;
        }

        if (count == 5) {
          return true;
        }
      }
    }

    // check columns
    for (let i = 0; i < 10; i++) {
      let count = 0;
      for (let j = 0; j < 10; j++) {
        if (newBoard[j][i].card === "J1") {
          count++;
        } else if (newBoard[j][i].color === color) {
          count++;
        } else {
          count = 0;
        }

        if (count === 5) {
          return true;
        }
      }
    }

    // check main diagonal
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        let count = 0;
        for (let k = 0; k < 5; k++) {
          if (newBoard[i + k][j + k].card === "J1") {
            count++;
          } else if (newBoard[i + k][j + k].color === color) {
            count++;
          } else {
            count = 0;
          }

          if (count === 5) {
            return true;
          }
        }
      }
    }

    // check anti diagonal
    for (let i = 0; i < 6; i++) {
      for (let j = 4; j < 10; j++) {
        let count = 0;

        for (let k = 0; k < 5; k++) {
          if (newBoard[i + k][j - k].card === "J1") {
            count++;
          } else if (newBoard[i + k][j - k].color === color) {
            count++;
          } else {
            count = 0;
          }

          if (count === 5) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const HandleCardClick = (card) => {
    const color = colors[Index % teams];

    const newBoard = Board.board.map((row) =>
      row.map((cell) => {
        if (cell.card === card && cell.color === "none") {
          // update BoardMap as well
          setBoardMap({ ...BoardMap, [card]: color });
          setIndex(Index + 1);
          return { ...cell, color: colors[Index % teams] };
        }

        return cell;
      })
    );

    const neww = { index: Board.index, board: newBoard };

    setBoard(neww);
    if (WinCheck(color, neww)) {
      win(color);
      setInterval(() => {
        window.location.reload();
      }, 3000);
    }
    addPlayer(userName);
  };

  useEffect(() => {
    addPlayer(userName);
  });

  return (
    <div>

    <div className="main">
        <div className='Player-details'>
            <div className="players">Players: {players}</div>
            <div className="game-code">Game Code: {}</div>
        </div>


        <div className="board">
        <div className="heading1">SEQUENCE</div>

        <div className="grids">
          <div className="token_grid">
            {Board.board.map((row, rowIndex) => (
              <div key={rowIndex} className="token-row">
                {row.map((cell, cellIndex) => {
                  if (cell.color === "red") {
                    return (
                      <img
                        onClick={() => HandleCardClick(cell.card)}
                        key={`${rowIndex}-${cellIndex}`}
                        src={red_token}
                        alt="red_token"
                        className="token"
                      />
                    );
                  } else if (cell.color === "blue") {
                    return (
                      <img
                        onClick={() => HandleCardClick(cell.card)}
                        key={`${rowIndex}-${cellIndex}`}
                        src={blue_token}
                        alt="blue_token"
                        className="token"
                      />
                    );
                  } else if (cell.color === "green") {
                    return (
                      <img
                        onClick={() => HandleCardClick(cell.card)}
                        key={`${rowIndex}-${cellIndex}`}
                        src={green_token}
                        alt="green_token"
                        className="token"
                      />
                    );
                  } else {
                    return (
                      <img
                        onClick={() => HandleCardClick(cell.card)}
                        key={`${rowIndex}-${cellIndex}`}
                        src={empty_token}
                        alt="nothing"
                        className="token"
                      />
                    );
                  }
                })}
              </div>
            ))}
          </div>

          <div className="cards">
            {Board.board.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, cellIndex) => {
                  const cardName = cell.card.split("_")[0];
                  const CardComponent = deck[cardName];

                  return (
                    <CardComponent
                      key={`${rowIndex}-${cellIndex}`}
                      onClick={() => HandleCardClick(cell.card)}
                      className="one_card"
                      style={{ height: "100%", width: "100%" }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="heading2">SEQUENCE</div>
      </div>


        <div className="your_cards">Your Cards</div>
      </div>

      <ToastContainer />
    </div>
  );
};

Game.propTypes = {
  players: PropTypes.number.isRequired,
};

export default Game;

