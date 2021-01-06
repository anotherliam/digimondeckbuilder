import styled from "@emotion/styled";
import {
  Button,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add as AddIcon, Remove as RemoveIcon } from "@material-ui/icons";
import { Link, RouteComponentProps } from "@reach/router";
import React from "react";
import { UseCardsResult } from "../Cards";
import { useDeck } from "../deck";
import { FilterAction, FilterState } from "../Filters";
import FilterPanel from "../panels/FilterPanel";
import CardImage from "./CardImage";

export const CARDS_PER_PAGE = 30;

const PageButtonsContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const useStyles = makeStyles((theme) => ({
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
    alignItems: "top",
    flexWrap: "wrap",
  },
  card: ({ width }: { width: number }) => ({
    width: width + theme.spacing(2),
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  }),
  cardInfo: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  deckButtons: {
    display: "flex",
    alignItems: "center",
  },
}));

interface Props extends RouteComponentProps {
  filtered: UseCardsResult;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  filterDispatch: React.Dispatch<FilterAction>;
  filterState: FilterState;
}

const CardListView: React.FC<Props> = ({
  handleNextPage,
  handlePrevPage,
  filtered,
  filterDispatch,
  filterState,
}) => {
  console.log("Rendering CardListView, filtered is: ", filtered);
  const [deck, handleChangeDeck] = useDeck();

  // Card size
  const theme = useTheme();
  let cardSize = 0;
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  if (isLg) {
    cardSize = 200;
  } else if (isMd) {
    cardSize = 140;
  } else {
    // sm
    cardSize = 80;
  }

  const classes = useStyles({ width: cardSize });
  const { actualPage, numPages, cards, totalFilteredCards } = filtered;
  const startNum = actualPage * CARDS_PER_PAGE + 1;
  const endNum = startNum + cards.length - 1;
  const isFirst = actualPage <= 0;
  const isLast = actualPage >= numPages - 1;
  const pageString = `Showing ${startNum}-${endNum} of ${totalFilteredCards} cards`;
  return (
    <>
      <Typography variant="h5">Cards</Typography>
      <FilterPanel dispatch={filterDispatch} state={filterState} />
      <Typography>{pageString}</Typography>
      <PageButtonsContainer>
        <Button disabled={isFirst} onClick={handlePrevPage}>
          Prev
        </Button>
        <Button disabled={isLast} onClick={handleNextPage}>
          Next
        </Button>
      </PageButtonsContainer>
      <div className={classes.gridContainer}>
        {filtered.cards.map((card) => {
          const section = card.cardType === "Digi-Egg" ? "egg" : "main";
          const quantityInDeck = deck[section][card.number] || 0;
          return (
            <div key={card.number} className={classes.card}>
              <Link to={`/card/${card.number}`}>
                <CardImage
                  name={`${card.number} ${card.name}`}
                  src={card.printings[0].imageURL}
                  size={cardSize}
                />
              </Link>
              <span className={classes.cardInfo}>
                <Link to={`/card/${card.number}`}>
                  <Button>{card.name}</Button>
                </Link>
                {quantityInDeck >= 1 ? (
                  <span className={classes.deckButtons}>
                    <Tooltip title="Remove 1">
                      <IconButton
                        aria-label="add"
                        onClick={() =>
                          handleChangeDeck(card.number, -1, section)
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">{quantityInDeck}</Typography>
                    <Tooltip title="Add 1">
                      <IconButton
                        aria-label="add"
                        onClick={() =>
                          handleChangeDeck(card.number, 1, section)
                        }
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </span>
                ) : (
                  <span>
                    <Button
                      aria-label="add"
                      onClick={() => handleChangeDeck(card.number, 1, section)}
                    >
                      Add to Deck
                    </Button>
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      <Typography>{pageString}</Typography>
      <PageButtonsContainer>
        <Button disabled={isFirst} onClick={handlePrevPage}>
          Prev
        </Button>
        <Button disabled={isLast} onClick={handleNextPage}>
          Next
        </Button>
      </PageButtonsContainer>
    </>
  );
};

export default CardListView;
