import React from "react";
import { CardDetails } from "../Cards";
import DeckListItem from "./DeckListItem";
import { DeckSection } from "../deck";
import { makeStyles, Typography } from "@material-ui/core";

interface Props {
    cards: [CardDetails, number][];
    title: string;
    handleChangeDeck: (cardToChange: string, changeBy: number, section: DeckSection) => void;
}

const DeckListSection: React.FC<Props> = ({ cards, title, handleChangeDeck }) => {
    const classes = useStyles();
    if (cards.length <= 0) return null;
    const num = cards.reduce((acc, [_, num]) => num + acc, 0);
    return <>
        <Typography  variant="caption">{title} (x{num})</Typography>
        <div className={classes.container}>
            {cards.map(([card, num]) => (
                <DeckListItem card={card} quantity={num} handleChangeCardBy={(by: number) => handleChangeDeck(card.number, by, "main")} />
            ))}
        </div>
    </>
}

const useStyles = makeStyles((theme) => ({
    container: {
    }
}))

export default DeckListSection;