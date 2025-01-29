import { createContext, useState } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [selectedCard, setSelectedCard] = useState(null); // Selected card
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Player who selected the card

  return (
    <GameContext.Provider
      value={{ selectedCard, setSelectedCard, selectedPlayer, setSelectedPlayer }}
    >
      {children}
    </GameContext.Provider>
  );
};