import {
  Typography,
  TextField,
  Select,
  Input,
  MenuItem,
  InputAdornment,
  Paper,
  makeStyles,
  FormControl,
  InputLabel,
  Button,
} from "@material-ui/core";
import { COLOURS, CARD_TYPES, RARITIES, SETS } from "../Cards";
import React from "react";
import { FilterAction, FilterState, SortableBy } from "../Filters";
import { SearchRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 140
  },
  clearButtonContainer: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

interface Props {
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      minWidth: 150,
    },
  },
};

const FilterPanel: React.FC<Props> = ({ dispatch, state }) => {
  const classes = useStyles();
  const handleChangeColours = (ev: any) =>
    dispatch({ type: "colours", value: ev.target.value });
  const handleChangeCardTypes = (ev: any) =>
    dispatch({ type: "cardTypes", value: ev.target.value });
  const handleChangeSearch = (ev: any) =>
    dispatch({ type: "text", value: ev.target.value });
  const handleChangeLevel = (ev: any) =>
    dispatch({ type: "level", value: ev.target.value });
    const handleChangeSet = (ev: any) =>
      dispatch({ type: "set", value: ev.target.value });
  const handleChangeRarity = (ev: any) =>
    dispatch({ type: "rarity", value: ev.target.value });
  const handleClearFilters = () => dispatch({ type: "clear" });
  const handleChangeSort = (ev: any) => dispatch({ type: "sortBy", value: ev.target.value });
  return (
    <div>
      <div className={classes.clearButtonContainer}>
        <Button onClick={handleClearFilters}>Clear Filters</Button>
      </div>
      <div className={classes.container}>
        <div className={classes.formControl}>
          <TextField
            value={state.filters.text}
            onChange={handleChangeSearch}
            size="small"
            margin="dense"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded />
                </InputAdornment>
              ),
            }}
            type="search"
            label="Search Name & Text"
          />
        </div>
        <FormControl className={classes.formControl}>
          <InputLabel>Colour</InputLabel>
          <Select
            MenuProps={MenuProps}
            multiple
            value={state.filters.colours}
            onChange={handleChangeColours}
            input={<Input />}
          >
            {COLOURS.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Card Type</InputLabel>
          <Select
            MenuProps={MenuProps}
            multiple
            value={state.filters.cardTypes}
            onChange={handleChangeCardTypes}
            input={<Input />}
          >
            {CARD_TYPES.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Level</InputLabel>
          <Input
            value={state.filters.level}
            onChange={handleChangeLevel}
            type="number" />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Set</InputLabel>
          <Select
            MenuProps={MenuProps}
            multiple
            value={state.filters.set}
            onChange={handleChangeSet}
            input={<Input />}
          >
            {SETS.map((set) => (
              <MenuItem key={set} value={set}>
                {set}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Rarity</InputLabel>
          <Select
            MenuProps={MenuProps}
            multiple
            value={state.filters.rarity}
            onChange={handleChangeRarity}
            input={<Input />}
          >
            {RARITIES.map((rarity) => (
              <MenuItem key={rarity} value={rarity}>
                {rarity}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={classes.container}>
        <FormControl className={classes.formControl}>
          <InputLabel>Sort By</InputLabel>
          <Select
            MenuProps={MenuProps}
            value={state.sortBy}
            onChange={handleChangeSort}
            input={<Input />}
          >
            {SortableBy.map((sort) => (
              <MenuItem key={sort} value={sort}>
                {sort}
              </MenuItem>
            ))}
            
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default FilterPanel;
