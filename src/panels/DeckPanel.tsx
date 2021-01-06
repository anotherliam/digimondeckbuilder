import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Theme, Typography } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { CardDetails, CARDS } from "../Cards";
import { sum, sumBy } from "lodash";
import { Link, RouteComponentProps } from "@reach/router";
import { useDeck } from "../deck";
import DeckListItem from "../components/DeckListItem";

const MAX_MAIN_CARDS = 50;
const MAX_EGG_CARDS = 5;

interface StylesProps {
    eggOverflow: boolean;
    mainOverflow: boolean;
}

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
    eggNumText: ({ eggOverflow }) => ({
        color: eggOverflow ? theme.palette.warning.main : theme.palette.text.primary
    }),
    mainNumText: ({ mainOverflow }) => ({
        color: mainOverflow ? theme.palette.warning.main : theme.palette.text.primary
    })
}))

const cardCounter = ([_, num]:  [CardDetails, number]) => num;

const getCardsList = (deckSection: Record<string, number>) => {
    const cards: [CardDetails, number][] = Object.keys(deckSection).map((cardNum) => {
        const cardDetails = CARDS.find((c) => c.number === cardNum) as CardDetails; // Dangerously assuming that a card wont be invalid
        const num = deckSection[cardNum];
        return [cardDetails, num];
    });
    return cards;
}

interface Props {
}

const DeckPanel: React.FC<Props> = () => {

    const [deck, handleChangeDeck] = useDeck();
    const mainDeck = getCardsList(deck.main);
    const eggDeck = getCardsList(deck.egg);
    
    const totalMainDeckCards = sumBy(mainDeck, cardCounter);
    const totalEggDeckCards = sumBy(eggDeck, cardCounter);
    const mainOverflow = totalMainDeckCards > MAX_MAIN_CARDS;
    const eggOverflow = totalEggDeckCards > MAX_EGG_CARDS;

    const classes = useStyles({ eggOverflow, mainOverflow});

    return <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h5">
                Deck (
                <span className={classes.mainNumText}>{totalMainDeckCards}/50</span>
                {" "}+{" "}
                <span className={classes.eggNumText}>{totalEggDeckCards}/5</span>
                {" "}cards)
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div>
                <Typography variant="h6">Main</Typography>
                {mainDeck.map(([card, num]) => (
                    <DeckListItem card={card} quantity={num} handleChangeCardBy={(by: number) => handleChangeDeck(card.number, by, "main")} />
                ))}
            </div>
            <div>
                <Typography variant="h6">Egg</Typography>
                {eggDeck.map(([card, num]) => (
                    <DeckListItem card={card} quantity={num} handleChangeCardBy={(by: number) => handleChangeDeck(card.number, by, "egg")} />
                ))}
            </div>
        </AccordionDetails>
    </Accordion>;
};

export default DeckPanel;