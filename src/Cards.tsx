import React, { useMemo, useReducer, useRef } from "react";
import v1 from "./json/V.1.0.json";
import st1 from "./json/ST-1.json";
import st2 from "./json/ST-2.json";
import st3 from "./json/ST-3.json";
import { FilterState, getFilters } from "./Filters";
import { CardHeader } from "@material-ui/core";


/**
 * Currently just shipping JSON in the bundle - certainlny fine for now,
 * but we will maybe want a backend at some point and only send the relevant cards for searches.
 * Possibly TODO: Remove the JSON from the bundle and load it all seperately at least.
 */

export type CardDetails = typeof v1[0];

export const CARDS = [...st1, ...st2, ...st3, ...v1];

export const CARDS_BY_NUMBER: Record<string, CardDetails> = {};
CARDS.forEach((card) => CARDS_BY_NUMBER[card.number] = card);

const getUniqueFields = <T extends CardDetails[keyof CardDetails]>(field: keyof CardDetails): T[] => [...(new Set(CARDS.map((card) => (card[field] as T))))];

export const COLOURS = getUniqueFields<string>("color");

export const CARD_TYPES = getUniqueFields<string>("cardType");

export const RARITIES = getUniqueFields<string>("rarity");

export const getCardName = (cardNo: string) => CARDS_BY_NUMBER[cardNo].name;

type FilterableFields = "name" | "effect" | "digivolveEffect" | "securityEffect" | "level" | "color" | "cardType" | "rarity";

// Requires one of the fields to contain the value
export interface SingleFilter {
    type: "single";
    on: FilterableFields[];
    value: string;
}

// Requires one of the fields to contain at least one of the values
export interface MultiFilter {
    type: "multi";
    on: FilterableFields[];
    value: string[];
}

export type Filter = SingleFilter | MultiFilter;

export type FilterSet = Filter[]

export interface UseCardsResult {
    actualPage: number;
    numPages: number;
    cards: CardDetails[];
    totalFilteredCards: number;
}

const checkSingleFilter = (filter: SingleFilter, card: CardDetails): boolean => {
    let filterValue = filter.value.toLowerCase();
    for (let filterOn of filter.on) {
        if (card[filterOn].toLowerCase().includes(filterValue)) {
            return true;
        }
    }
    return false;
}

const checkMultiFilter = (filter: MultiFilter, card: CardDetails): boolean => {
    let filterValue = filter.value.map((f) => f.toLowerCase());
    if (filterValue.length <= 0) return true;
    for (let filterOn of filter.on) {
        if (filterValue.includes(card[filterOn].toLowerCase())) return true;
    }
    return false;
}

/**
 * A hook that returns a filtered and paginated array of cards
 * Theoretically this is memoized
 */
export const useCards = (filterState: FilterState, cardsPerPage: number, page: number): UseCardsResult => {
    const filterChangeKey = filterState.changeKey;
    const filterRef = useRef(0);
    let filterUpdated = false;
    if (filterRef.current !== filterChangeKey) {
        filterUpdated = true;
        filterRef.current = filterChangeKey;
    }

    const filterResultRef = useRef<CardDetails[] | null>(null);
    let filtered: CardDetails[];
    if (filterUpdated || filterResultRef.current === null) {
        const filters = getFilters(filterState);
        const { sortBy } = filterState;
        filtered = CARDS.filter((card) => {
            // Check each filter
            for (let filter of filters) {
                switch (filter.type) {
                    case "single":
                        if (!checkSingleFilter(filter, card)) return false;
                        break;
                    case "multi":
                        if (!checkMultiFilter(filter, card)) return false;
                        break;
                }
            }
            return true;
        });
        if (sortBy === "dp") {
            filtered = filtered.sort((a, b) => (+a[sortBy]) - (+b[sortBy]));
        } else {
            filtered = filtered.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
        }
        filterResultRef.current = filtered;
    } else {
        filtered = filterResultRef.current;
    }
    

    const numPages = (Math.ceil(filtered.length / cardsPerPage));

    // If page is out of bounds or if filters updated, reset to 0
    const actualPage = (filterUpdated || page >= numPages) ? 0 : page;
    // If theres only one page just return it
    if (numPages <= 1) {
        return {
            cards: filtered,
            numPages,
            actualPage,
            totalFilteredCards: filtered.length
        };
    }

    // Otherwise do some pagination
    const start = cardsPerPage * actualPage;
    const end = start + cardsPerPage;
    // Start(Included) -> End(Excluded)
    const paginatedCards = filtered.slice(start, end);

    return {
        cards: paginatedCards,
        totalFilteredCards: filtered.length,
        numPages,
        actualPage
    }

}