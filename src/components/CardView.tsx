import {
  Button,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { navigate, RouteComponentProps } from "@reach/router";
import React, { useMemo } from "react";
import { CardDetails, CARDS } from "../Cards";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Remove as RemoveIcon,
} from "@material-ui/icons";
import { useDeck } from "../deck";

const useStyles = makeStyles((theme) => ({
  deckButtons: {
    display: "flex",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start"
  },
  nameContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1)
  }
}));

interface Props extends RouteComponentProps {
  cardNum?: string;
}

const CardView: React.FC<Props> = ({ cardNum }) => {
  const [deck, handleChangeDeck] = useDeck();

  const classes = useStyles();

  const card = useMemo(() => {
    return CARDS.find(
      (card) => card.number.toLowerCase() === cardNum?.toLowerCase()
    );
  }, [cardNum]);

  if (!card) {
    return (
      <>
        <Typography>Card not found...</Typography>
      </>
    );
  }

  const section = card.cardType === "Digi-Egg" ? "egg" : "main";
  const quantityInDeck = deck[section][card.number] || 0;

  return (
    <div className={classes.container}>
      <div className={classes.nameContainer}>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">{card?.name}</Typography>
      </div>
      <>
        
        <img src={card.printings[0].imageURL} width={300} />
        {quantityInDeck >= 1 ? (
          <span className={classes.deckButtons}>
            <Typography>In Deck: </Typography>
            <Tooltip title="Remove 1">
              <IconButton
                aria-label="add"
                onClick={() => handleChangeDeck(card.number, -1, section)}
              >
                <RemoveIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="body2">{quantityInDeck}</Typography>
            <Tooltip title="Add 1">
              <IconButton
                aria-label="add"
                onClick={() => handleChangeDeck(card.number, 1, section)}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </span>
        ) : (
          <span>
          <Typography component="span">Not In Deck </Typography>
            <Button
              aria-label="add"
              onClick={() => handleChangeDeck(card.number, 1, section)}
            >
              Add to Deck
            </Button>
          </span>
        )}
      </>
    </div>
  );
};

export default CardView;
