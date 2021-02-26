import { CardDetails, FilterSet } from "./Cards";

export interface FilterState {
    filters: {
        colours: string[],
        cardTypes: string[],
        text: string,
        level: string,
        rarity: string[],
        set: string[]
    },
    changeKey: number,
    sortBy: SortableByKeys
}

export interface FilterUpdateAction {
    type: keyof FilterState["filters"],
    value: string | string[]
}

export interface FilterClearAction {
    type: "clear"
}

export const SortableBy = ["color", "level", "dp"] as const;
type SortableByKeys = typeof SortableBy[number];

export interface SortAction {
    type: "sortBy",
    value: SortableByKeys
}

export type FilterAction = FilterUpdateAction | FilterClearAction | SortAction

export const initialFilterState = (): FilterState => ({
    filters: {
        colours: [],
        text: "",
        level: "",
        rarity: [],
        cardTypes: [],
        set: []
    },
    changeKey: 0,
    sortBy: "color"
});

export const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
    if (action.type === "clear") {
        return initialFilterState();
    } else if (action.type === "sortBy") {
        return {
            ...state,
            sortBy: action.value,
            changeKey: (state.changeKey === 0) ? 1 : state.changeKey * -1
        };
    } else {
        return {
            ...state,
            filters: {
                ...state.filters,
                [action.type]: action.value
            },
            changeKey: (state.changeKey === 0) ? 1 : state.changeKey * -1
        }
    }
}

export const getFilters = (filterState: FilterState): FilterSet => {
    const filters: FilterSet = [];
    if (filterState.filters.colours.length >= 1) {
        filters.push({
            type: "multi",
            value: filterState.filters.colours,
            on: ["color"]
        });
    }
    if (filterState.filters.cardTypes.length >= 1) {
        filters.push({
            type: "multi",
            value: filterState.filters.cardTypes,
            on: ["cardType"]
        });
    }
    if (filterState.filters.text.length >= 1) {
        filters.push({
            type: "single",
            value: filterState.filters.text,
            on: ["name", "effect", "digivolveEffect", "securityEffect"]
        });
    }
    if (filterState.filters.level.length >= 1) {
        filters.push({
            type: "single",
            value: filterState.filters.level,
            on: ["level"]
        });
    }
    if (filterState.filters.rarity.length >= 1) {
        filters.push({
            type: "multi",
            value: filterState.filters.rarity,
            on: ["rarity"]
        });
    }
    if (filterState.filters.set.length >= 1) {
        filters.push({
            type: "set",
            value: filterState.filters.set
        });
    }
    return filters;
}