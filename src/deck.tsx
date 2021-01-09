import { clamp } from "lodash";
import React, { createContext, useContext, useState } from "react";
import { createNew } from "typescript";
import { getCardName } from "./Cards";

const WIP_KEY = "wip";
export interface Deck {
  main: Record<string, number>;
  egg: Record<string, number>;
}
type DeckSection = "main" | "egg";

type DeckContextType = [
  Deck | null,
  React.Dispatch<React.SetStateAction<Deck | null>>
];
type DeckUpdater = (
  cardToChange: string,
  changeBy: number,
  section: DeckSection
) => void;
type DeckReplacer = (replacer: (prev: Deck) => Deck) => void;

const DeckContext = createContext<DeckContextType>([null, () => {}]);

const createNewDeck = (): Deck => ({
  main: {},
  egg: {},
});

const loadAndParseDeck = () => {
  console.log("Loading deck from local storage");
  const deckAsString = localStorage.getItem(WIP_KEY);
  if (deckAsString === null) {
    // No deck saved so we return a fresh deck
    return createNewDeck();
  }
  try {
    const parsed: Deck = JSON.parse(deckAsString);
    // validate
    if (!parsed.egg || typeof parsed.egg !== "object") {
      console.warn("Egg deck was missing from loaded deck");
      parsed.egg = {};
    }
    if (!parsed.main || typeof parsed.main !== "object") {
      console.warn("Main deck was missing from loaded deck");
      parsed.main = {};
    }
    return parsed;
  } catch (er) {
    // Error loading so lets just return a fresh deck
    console.warn("Error loading deck ", er);
    return createNewDeck();
  }
};

export const useDeck = (): [Deck, DeckUpdater, DeckReplacer] => {
  const [deck, setDeck] = useContext(DeckContext);
  const update: DeckUpdater = (cardToChange, changeBy, section) => {
    setDeck((prevDeck) => {
      let newDeck = createNewDeck();
      if (prevDeck === null) {
        // No prev deck, so just set the first card
        if (changeBy >= 1) {
          newDeck[section][cardToChange] = clamp(changeBy, 1, 4);
        }
      } else {
        // Prev deck exists so copy it in
        newDeck.main = { ...prevDeck.main };
        newDeck.egg = { ...prevDeck.egg };
        // Prev deck exists, check how many copies of the card are already in
        const cardsInDeck = prevDeck[section][cardToChange] || 0;
        const newCardsInDeck = clamp(cardsInDeck + changeBy, 0, 4);
        if (newCardsInDeck <= 0) {
          // If we would go down to 0 cards in deck, just remove it from the object
          delete newDeck[section][cardToChange];
        } else {
          // Otherwise we set the card to the new value
          newDeck[section][cardToChange] = newCardsInDeck;
        }
      }
      // Save deck before returning it to setState
      localStorage.setItem(WIP_KEY, JSON.stringify(newDeck));
      return newDeck;
    });
  };
  const replace: DeckReplacer = (replacerFunc) => {
    setDeck((prevDeck) => {
      let newDeck;
      if (prevDeck === null) {
        newDeck = replacerFunc(createNewDeck());
      } else {
        newDeck = replacerFunc(prevDeck)
      }
      localStorage.setItem(WIP_KEY, JSON.stringify(newDeck));
      return newDeck;
    })
  }
  // If deck is null see if we can load one from local storage
  if (deck === null) {
    const loadedDeck = loadAndParseDeck();
    setDeck(loadedDeck);
    return [loadedDeck, update, replace];
  }
  // Deck exists
  return [deck, update, replace];
};

// Helpers

const exportAsText = (deck: Deck) => {
  const mapper = (item: Record<string, number>) =>
    Object.entries(item).map(
      ([cardNo, quantity]) => `${quantity} ${cardNo} (${getCardName(cardNo)})`
    );
  const content = [
    "[MAIN]",
    ...mapper(deck.main),
    "[EGG]",
    ...mapper(deck.egg),
  ].join("\n");
  const tag = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  tag.href = URL.createObjectURL(file);
  tag.download = "digimon deck.txt";
  tag.click();
  tag.remove();
  return true;
};

const clearDeck = (replaceDeck: DeckReplacer) => {
  replaceDeck(() => createNewDeck());
}

export const useDeckHelpers = () => {
  const [deck, updateDeck, replaceDeck] = useDeck()
  return {
    exportAsText: () => exportAsText(deck),
    clearDeck: () => clearDeck(replaceDeck)
  };
};

export const DeckProvider: React.FC = ({ children }) => {
  const state = useState<Deck | null>(null);
  return <DeckContext.Provider value={state}>{children}</DeckContext.Provider>;
};
