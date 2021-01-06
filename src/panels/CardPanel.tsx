import {
    makeStyles,
    Paper
} from "@material-ui/core";
import { Router } from "@reach/router";
import React, { useReducer, useState } from "react";
import { CardDetails, CARDS, useCards } from "../Cards";
import CardListView, { CARDS_PER_PAGE } from "../components/CardListView";
import CardView from "../components/CardView";
import {
    filterReducer,
    initialFilterState
} from "../Filters";


interface Props {}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  gridContainer: {
    marginLeft: 1,
    marginRight: 1,
    [theme.breakpoints.up("md")]: {
      marginLeft: "8%",
      marginRight: "8%",
    },
    [theme.breakpoints.up("lg")]: {
      marginLeft: "12%",
      marginRight: "12%",
    },
    [theme.breakpoints.up("xl")]: {
      marginLeft: "20%",
      marginRight: "20%",
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
}));

const CardPanel: React.FC<Props> = () => {
  const classes = useStyles();
  // State
  const [filterState, filterDispatch] = useReducer(
    filterReducer,
    undefined,
    initialFilterState
  );
  const [page, setPage] = useState(0);
  const filtered = useCards(filterState, CARDS_PER_PAGE, page);
  console.log("Rendering CardPanel, filtered is: ", filtered);
  return (
    <Paper className={classes.paper} elevation={3}>
      <Router>
        <CardListView
          filterDispatch={filterDispatch}
          filterState={filterState}
          path="/"
          handleNextPage={() => setPage(filtered.actualPage + 1)}
          handlePrevPage={() => setPage(filtered.actualPage - 1)}
          filtered={filtered}
        />
        <CardView path="/card/:cardNum" />
      </Router>
    </Paper>
  );
};

export default CardPanel;
