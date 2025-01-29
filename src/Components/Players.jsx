import { useEffect, useState } from "react";
import { db } from "../Firebaseconfig";
import "../Styles/Players.css";
import PropTypes from "prop-types";
import { doc, onSnapshot } from "firebase/firestore";
import * as deck from "@letele/playing-cards";

const Players = (props) => {
  const [NumPlayers, setNumPlayers] = useState(0);
  const [Turn, setTurn] = useState(0);
  const [PlayerData, setPlayerData] = useState([]);

  useEffect(() => {
    // Real-time listener for game data
    const gameDocRef = doc(db, "game", props.code);

    const unsubscribe = onSnapshot(gameDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data();
        setNumPlayers(gameData.numPlayers || 0);
        setTurn(gameData.Turn || 0);
        setPlayerData([...gameData.Players]); // Spread to ensure fresh reference
      } else {
        console.error("Game document does not exist");
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [props.code]);

  const teams = NumPlayers % 3 === 0 ? 3 : 2;

  const colors = [
    "rgb(255, 97, 97)",
    "rgb(85, 150, 255)",
    "rgba(105, 255, 78, 0.8)",
  ];

  return (
    <div className="Player-details">
      <div className="players">
        {PlayerData.map((player, index) => {

          // Dynamically fetch and render the card component
          const cardName = player.Last_card.split("-")[0];
          const CardComponent = deck[cardName];

          return (
            <div
            style={{
                backgroundColor: colors[index % teams],
                boxShadow: index === Turn % NumPlayers ? "0 0 10px 2px white" : "none",
              }}
              id={`player${index}`}
              className="player"
              key={index}
            >
              <div className="player_name">{player.PlayerName!=props.playername?player.PlayerName:
                    <div>{player.PlayerName} (You)</div>
                }</div>
              {CardComponent ? (
                <CardComponent style={{ height: "100%", width: "30%" }} />
              ) : (
                <div className="placeholder-card">No card</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Players.propTypes = {
  code: PropTypes.string.isRequired,
  playername: PropTypes.string.isRequired,
};

export default Players;