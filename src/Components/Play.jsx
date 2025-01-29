import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebaseconfig";
import Game from "./Game";
import Players from "./Players";
import YourCards from "./YourCards";

const Play = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const players = queryParams.get("players");
  const code = queryParams.get("code");
  const playername = queryParams.get("name");

  const [turn, setTurn] = useState(0);
  const [NumPlayers, setNumPlayers] = useState(0);
  const [winningTeamColor, setWinningTeamColor] = useState("");

  // Determine winning team color based on Turn and NumPlayers
  const calculateWinningTeamColor = (turn) => {
    const teams = NumPlayers % 3 === 0 ? 3 : 2;
    const colors = ['red', 'blue', 'green'];
    const color = colors[turn % teams];
    console.log(turn);
    return color;
  };

  // Listen for changes in Firebase data
  useEffect(() => {
    const gameDocRef = doc(db, "game", code);

    const unsubscribe = onSnapshot(gameDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data();
        setTurn(gameData.Turn || 0);
        setNumPlayers(gameData.numPlayers || 0);

        // Calculate and set winning team color
        if (gameData.Turn === -1) {
          const teamColor = calculateWinningTeamColor(gameData.Turn, gameData.numPlayers);
          setWinningTeamColor(teamColor);
        }
      } else {
        console.error("Game document does not exist");
      }
    });

    return () => unsubscribe();
  }, [code]);

  return (
    <div className="main">
      <div className="players">
        <Players playername={playername} code={code} />
      </div>

      <Game players={+players} code={code} playername={playername} />

      <div className="your_cards">
        {turn === -1 ? (
          <div className="winning-message">
            🎉 The winning team is: <strong style={{ color: winningTeamColor }}>{winningTeamColor}</strong>! 🎉
          </div>
        ) : (
          <YourCards code={code} playername={playername} />
        )}
      </div>
    </div>
  );
};

export default Play;