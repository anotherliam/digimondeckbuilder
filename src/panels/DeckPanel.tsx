import React, { Suspense, useMemo } from "react";
import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Theme, Typography, Card, Button } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { CardDetails, CARDS, LevelToFormMapping } from "../Cards";
import { sum, sumBy } from "lodash";
import { Link, RouteComponentProps } from "@reach/router";
import { DeckTypes, useDeck, useDeckHelpers } from "../deck";
import DeckListItem from "../components/DeckListItem";
import { AuthCheck, useUser } from "reactfire";
import DeckSaver from "../components/DeckSaver";
import DeckListSection from "../components/DeckListSection";

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
    }),
    container: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row"
    },
    statisticsContainer: {
        width: "80%",
        padding: theme.spacing(2)
    },
    deckSectionContainer: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
    },
    statsContainerInner: {
        display: "flex",
        flexDirection: "row",
        "& div": {
            margin: theme.spacing(1)
        }
    }
}))

const cardCounter = ([_, num]: [CardDetails, number]) => num;

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
    const { getStats } = useDeckHelpers();
    const mainDeck = getCardsList(deck.main);
    const eggDeck = getCardsList(deck.egg);
    
    const totalMainDeckCards = sumBy(mainDeck, cardCounter);
    const totalEggDeckCards = sumBy(eggDeck, cardCounter);
    const mainOverflow = totalMainDeckCards > MAX_MAIN_CARDS;
    const eggOverflow = totalEggDeckCards > MAX_EGG_CARDS;

    const classes = useStyles({ eggOverflow, mainOverflow });

    const sortedEggs = useMemo(() => [...eggDeck].sort(([a], [b]) => a.name.localeCompare(b.name)), [eggDeck]);
    const cardsBySection = useMemo(() => {
        const options = mainDeck.filter(([card]) => card.cardType.toLowerCase() === "option");
        const tamers = mainDeck.filter(([card]) => card.cardType.toLowerCase() === "tamer");
        const allDigimon = mainDeck.filter(([card]) => card.cardType.toLowerCase() === "digimon");
        const digimon = new Map<string, [CardDetails, number][]>();
        allDigimon.forEach(([digi, num]) => {
            const list = digimon.get(digi.level);
            if (list) list.push([digi, num]);
            else digimon.set(digi.level, [[digi, num]]);
        })
        // Sort digimon into levels 
        return {
            digimon: [...digimon.entries()].sort((a, b) => a[0].localeCompare(b[0])),
            options,
            tamers
        }
    }, [mainDeck])

    return <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h5">
                {deck.type === DeckTypes.Temporary ? "Unsaved Deck" : deck.name} (
                <span className={classes.mainNumText}>{totalMainDeckCards}/50</span>
                {" "}+{" "}
                <span className={classes.eggNumText}>{totalEggDeckCards}/5</span>
                {" "}cards)
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div>
                <Suspense fallback={null}>
                    <DeckSaver />
                </Suspense>
                <div className={classes.container}>
                    <div className={classes.deckSectionContainer}>
                        <Typography variant="h6">Main</Typography>
                        <DeckListSection title="Options" cards={cardsBySection.options} handleChangeDeck={handleChangeDeck} />
                        <DeckListSection title="Tamers" cards={cardsBySection.tamers} handleChangeDeck={handleChangeDeck} />
                        {
                            cardsBySection.digimon.map(([level, digis]) => (
                                <DeckListSection title={level} cards={digis} handleChangeDeck={handleChangeDeck} />
                            ))
                        }
                    </div>
                    <div className={classes.deckSectionContainer}>
                        <Typography variant="h6">Egg</Typography>
                        {sortedEggs.map(([card, num]) => (
                            <DeckListItem card={card} quantity={num} handleChangeCardBy={(by: number) => handleChangeDeck(card.number, by, "egg")} />
                        ))}
                    </div>
                </div>
            </div>
        </AccordionDetails>
    </Accordion>;
};

export default DeckPanel;