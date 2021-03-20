import {
  Button,
  makeStyles,
  Paper,
  Popover,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Link, navigate } from "@reach/router";
import React from "react";
import { CardDetails } from "../Cards";
import { useDeck } from "../deck";
import CardImage from "./CardImage";

interface StyleProps {
  cardCol: string;
  cardImg: string;
}
const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  container: ({ cardImg }) => ({
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing(0.5),
    alignItems: "center",
    margin: theme.spacing(1),
    backgroundImage: `url(${cardImg})`,
    backgroundPosition: "center",
    backgroundSize: 140
  }),
  quantity: ({ cardCol }) => ({
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    border: `solid 1px ${cardCol}`,
    borderRadius: "4px",
    padding: theme.spacing(0.5),
    position: "relative",
    color: "black",
    textShadow: `-1px -1px 0 #fff,
     1px -1px 0 #fff,
     -1px 1px 0 #fff,
      1px 1px 0 #fff`,
  }),
  name: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    textShadow: `-1px -1px 0 #000,
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000`,
  },
  decButton: {
    padding: 0,
    margin: 0,
    minWidth: "unset",
    marginRight: theme.spacing(1),
  },
  incButton: {
    padding: 0,
    margin: 0,
    minWidth: "unset",
  },
  popover: {
    pointerEvents: 'none'
  },
}));

interface Props {
  card: CardDetails;
  quantity: number;
  handleChangeCardBy: (by: number) => void;
}

const DeckListItem: React.FC<Props> = ({
  card,
  quantity,
  handleChangeCardBy,
}) => {

const src = card.printings[0].imageURL;

  const classes = useStyles({
    cardCol: card.color,
    cardImg: src,
  });


  // Popover
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const popoverOpen = Boolean(anchorEl);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleClickQuantity = (ev: React.MouseEvent) => {
    if (ev.ctrlKey || ev.metaKey) {
        handleChangeCardBy(-1);
    } else {
        handleChangeCardBy(1);
    }
  }
  return (
    <>
      <Paper
        className={classes.container}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <Button className={classes.decButton} onClick={handleClickQuantity}>
          <Typography
            component={"span"}
            className={classes.quantity}
            variant="body2"
          >
            {quantity}
          </Typography>
        </Button>
        <Button className={classes.incButton} onClick={() => navigate(`/card/${card.number}`)}>
          <Typography className={classes.name} variant="body1">
            {card.name}
          </Typography>
        </Button>
      </Paper>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={popoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div>
          <CardImage src={src} size={200} name={card.name} />
        </div>
      </Popover>
    </>
  );
};

export default DeckListItem;
