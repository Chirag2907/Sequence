import { useEffect, useState, useContext } from "react";
import { db } from "../Firebaseconfig";
import "../Styles/YourCards.css";
import PropTypes from "prop-types";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import * as deck from "@letele/playing-cards";
import { GameContext } from "../context"; // Import the context

const YourCards = (props) => {
  const [NumPlayers, setNumPlayers] = useState(0);
  const [Turn, setTurn] = useState(0);
  const [PlayerData, setPlayerData] = useState([]);

  const { selectedCard, setSelectedCard } = useContext(GameContext); // Access context

  const numCards = {
    2: 7,
    3: 6,
    4: 6,
    6: 5,
    8: 4,
    9: 4,
    10: 3,
    12: 3,
  };

  useEffect(() => {
    const gameDocRef = doc(db, "game", props.code);

    const unsubscribe = onSnapshot(gameDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data();
        setNumPlayers(gameData.numPlayers || 0);
        setTurn(gameData.Turn || 0);
        setPlayerData([...gameData.Players]);
      } else {
        console.error("Game document does not exist");
      }
    });

    return () => unsubscribe();
  }, [props.code]);

  useEffect(() => {
    if (!NumPlayers || PlayerData.length === 0) return; // Wait for PlayerData to load
  
    const maxCards = numCards[NumPlayers] || 0;
  
    // Create a new updatedPlayers array
    const updatedPlayers = PlayerData.map((player) => {
      // Only modify the player if they need more cards in their hand
      if (player.Player_hand.length < maxCards) {
        const newHand = [...player.Player_hand]; // Create a copy of Player_hand
  
        while (
          newHand.length < maxCards &&
          player.Card_idx < player.Player_deck.length
        ) {
          const nextCard = player.Player_deck[player.Card_idx];
          newHand.push(nextCard); // Add the next card from the deck
          player.Card_idx += 1; // Increment the deck index
        }
  
        return {
          ...player,
          Player_hand: newHand, // Replace Player_hand with the updated hand
        };
      }
      return player; // Return the player unchanged if no updates are needed
    });
  
    // Check for changes before updating state or Firestore
    const hasChanges = updatedPlayers.some((player, index) => {
      return JSON.stringify(player.Player_hand) !== JSON.stringify(PlayerData[index].Player_hand);
    });
  
    if (hasChanges) {
      setPlayerData(updatedPlayers); // Update the local state
      const gameDocRef = doc(db, "game", props.code);
      updateDoc(gameDocRef, { Players: updatedPlayers }); // Update Firestore
    }
  }, [NumPlayers, PlayerData, props.code]);
  const handleCardClick = (card) => {
    setSelectedCard(card); // Save selected card in the context
  };

  return (
    <div>
      <div className="Your_cards_heading">Your Cards:</div>
      <div className="player-hand">
        {PlayerData.map((player) => {
          if (player.PlayerName === props.playername) {
            return player.Player_hand.map((handCard, handIndex) => {
              const HandCardComponent = deck[handCard.split("-")[0]];
              return (
                <div
                  key={handIndex}
                  onClick={() => handleCardClick(handCard)} // Highlight card on click
                >
                  {HandCardComponent ? (
                    <HandCardComponent
                      className={`hand-card ${
                        selectedCard === handCard ? "selected-card" : ""
                      }`}
                      style={{ height: "100%", width: "30%" }}
                    />
                  ) : (
                    <div className="placeholder-card">{handCard}</div>
                  )}
                </div>
              );
            });
          }
          return null;
        })}
      </div>
    </div>
  );
};

YourCards.propTypes = {
  code: PropTypes.string.isRequired,
  playername: PropTypes.string.isRequired,
};

export default YourCards;