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
} from "@material-ui/core";
import { COLOURS, CARD_TYPES } from "../Cards";
import React from "react";
import { FilterAction, FilterState } from "../Filters";
import { SearchRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 140
  },
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
  return (
    <div className={classes.container}>
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
    </div>
  );
};

export default FilterPanel;
