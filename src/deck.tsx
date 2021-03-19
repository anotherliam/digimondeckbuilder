import { clamp } from "lodash";
import React, { createContext, useContext, useState } from "react";
import { CardDetails, CARDS_BY_NUMBER, getCardName } from "./Cards";
import { useFirebaseApp } from "reactfire";
import Firebase from "firebase";

export type CloudSavedDeck = Partial<{
  created: Firebase.firestore.Timestamp;
  egg: Record<string, number>;
  main: Record<string, number>;
  mtime: Firebase.firestore.Timestamp;
  name: string;
  status: DeckPrivacyStatuses;
  user: string;
  _id: string;
}>

export enum DeckPrivacyStatuses {
  Private = 0,
  Public = 10
}

export enum DeckTypes {
  Persisted = "persisted",
  Temporary = "temp"
}

interface DeckBase {
  main: Record<string, number>;
  egg: Record<string, number>;
}

export interface PersistedDeck extends DeckBase {
  type: DeckTypes.Persisted;
  cloudId: string;
  name: string;
  dirty: boolean; // Whether the deck has been edited and needs to be resaved
}

export interface TempDeck extends DeckBase {
  type: DeckTypes.Temporary;
}

const WIP_KEY = "wip";
export type Deck = PersistedDeck | TempDeck;
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

const DeckContext = createContext<DeckContextType>([null, () => { }]);

const createNewDeck = (): Deck => ({
  type: DeckTypes.Temporary,
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
        newDeck = { ...prevDeck };
        newDeck.main = { ...prevDeck.main };
        newDeck.egg = { ...prevDeck.egg };
        if (newDeck.type === DeckTypes.Persisted) newDeck.dirty = true;
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

const saveDeckToCloud = async (name: string, deck: Deck, user: Firebase.User, fbApp: Firebase.app.App, replaceDeck: DeckReplacer) => {
  const db = fbApp.firestore();
  const { egg, main } = deck;
  if (deck.type === DeckTypes.Persisted) {
    console.warn("Updating save ", deck.cloudId)
    // Deck is already a saved deck
    await db.collection("decks").doc(deck.cloudId).update({
      egg,
      main,
      name,
      mtime: Firebase.firestore.FieldValue.serverTimestamp()
    });
    replaceDeck((prev) => ({ ...prev, dirty: false }));
  } else {
    // First save uwu
    console.warn("First save")
    const newCloudDeck = {
      egg,
      main,
      name,
      user: user.uid,
      status: DeckPrivacyStatuses.Private,
      mtime: Firebase.firestore.FieldValue.serverTimestamp(),
      created: Firebase.firestore.FieldValue.serverTimestamp()
    };
    console.log({ newCloudDeck });
    const { id } = await db.collection("decks").add(newCloudDeck)
    console.log("Done! ", id)
    // Replace the deck
    console.log("replacin deck");
    replaceDeck((prev) => ({
      ...prev,
      type: DeckTypes.Persisted,
      cloudId: id,
      name,
      dirty: false
    }));
    console.log("deck replaced");
    return true;
  }
}

const loadCloudDeck = (deck: CloudSavedDeck, replace: DeckReplacer): boolean => {
  const { egg, main, status, name, _id } = deck;
  if (egg === undefined || main === undefined || status === undefined || name === undefined || _id === undefined) {
    console.error("Invalid deck");
    return false;
  } else {
    replace(() => ({
      type: DeckTypes.Persisted,
      dirty: false,
      cloudId: _id,
      name,
      egg,
      main 
    }));
    return true;
  }
}

const getArrayOfCardsFiltered = (deckEntries: [CardDetails, number][], cardType: string) =>
  deckEntries.flatMap(([card, count]) => card.cardType.toLowerCase() === cardType ? (new Array(count)).fill(card) : []);

const getDeckStats = (deck: Deck) => {
  // Get digimon count
  const deckEntries: [CardDetails, number][] = Object.entries(deck.main).map(([id, count]) => [CARDS_BY_NUMBER[id], count]);
  const digimon: CardDetails[] = getArrayOfCardsFiltered(deckEntries, "digimon");
  const optionCount: number = getArrayOfCardsFiltered(deckEntries, "option").length;
  const tamerCount: number = getArrayOfCardsFiltered(deckEntries, "tamer").length;
  const levelCounts: Record<string, number> = digimon.reduce((acc: Record<string, number>, { level }) => {
    acc[level] ? acc[level]++ : acc[level] = 1;
    return acc;
  }, {})
  return { optionCount, tamerCount, levelCounts: Object.entries(levelCounts).sort() };
}

export const useDeckHelpers = () => {
  const [deck, updateDeck, replaceDeck] = useDeck();
  const firebase = useFirebaseApp();
  return {
    exportAsText: () => exportAsText(deck),
    clearDeck: () => clearDeck(replaceDeck),
    getStats: () => getDeckStats(deck),
    saveDeckToCloud: (name: string, user: Firebase.User) => saveDeckToCloud(name, deck, user, firebase, replaceDeck),
    loadCloudDeck: (cloudDeck: CloudSavedDeck) => loadCloudDeck(cloudDeck, replaceDeck)
  };
};

export const DeckProvider: React.FC = ({ children }) => {
  const state = useState<Deck | null>(null);
  return <DeckContext.Provider value={state}>{children}</DeckContext.Provider>;
};
