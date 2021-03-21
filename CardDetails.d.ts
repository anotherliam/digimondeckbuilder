type CardColour = "black" | "red" | "blue" | "green" | "yellow" | "purple" | "white";

interface CardPrinting {
    name: string;
    set: string;
    imageURL: string;
}

// These are a bit fucky right now, due to the official site missing a lot of the info
interface DigivolveCost {
    cost: number;
    fromLevel: "unknown" | number;
    fromColor: "unknown" | "black" | "red" | "blue" | "green" | "yellow" | "purple" | "white";
}

// Card details shared by every card
interface BaseCardDetails {
    name: string;
    number: string;
    rarity: "c" | "u" | "r" | "sr" | "sec";
    color: CardColour;
    printings: CardPrinting[];
    notes: string;
}

interface DigimonCardDetails extends BaseCardDetails {
    cardType: "digimon";
    level: number;
    form: "rookie" | "champion" | "ultimate" | "mega"
    attribute: "free" | "data" | "vaccine" | "virus";
    type: string;
    dp: number;
    cost: number;
    digivolveCosts: DigivolveCost[];
    effect: string;
    inheritedEffect: string;
}

interface DigiEggCardDetails extends BaseCardDetails {
    cardType: "digi-egg";
    form: "in-training";
    type: string;
    inheritedEffect: string;
}

interface OptionCardDetails extends BaseCardDetails {
    cardType: "option";
    cost: number;
    effect: string;
    securityEffect: string;
}

interface TamerCardDetails extends BaseCardDetails {
    cardType: "tamer";
    cost: number;
    effect: string;
    securityEffect: string;
}

type CardDetails = DigimonCardDetails | DigiEggCardDetails | OptionCardDetails | TamerCardDetails;
