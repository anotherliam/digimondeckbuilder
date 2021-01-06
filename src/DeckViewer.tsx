import React from "react";

const CARDS = [
    "gabu",
    "pata",
    "agu"
]

interface Props {
    filterBy: string
}

const DeckViewer = ({ filterBy }: Props) => {
    const filteredCards = filterBy !== "" ? CARDS.filter((val) => val.includes(filterBy)) : CARDS;
    return <div>
        {filteredCards.map((card) => (<p>{card}</p>))}
    </div>
}

export default DeckViewer;