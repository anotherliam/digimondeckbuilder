import { FilterSet } from "./Cards";

export interface FilterState {
    filters: {
        colours: string[],
        cardTypes: string[],
        text: string,
        level: string
    },
    changeKey: number
}

export interface FilterAction {
    type: keyof FilterState["filters"],
    value: string | string[]
}

export const initialFilterState = (): FilterState => ({
    filters: {
        colours: [],
        text: "",
        level: "",
        cardTypes: []
    },
    changeKey: 1
});

export const filterReducer = (state: FilterState, action: FilterAction): FilterState => ({
    ...state,
    filters: {
        ...state.filters,
        [action.type]: action.value
    },
    changeKey: state.changeKey * -1
});

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
    return filters;
}