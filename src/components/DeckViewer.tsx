/**
 * This component is for viewing shared decks
 */

import { makeStyles, Paper } from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";

interface Props extends RouteComponentProps {

}

const DeckViewer: React.FC<Props> = () => {
    const classes = useStyles();
    return <Paper className={classes.paper}>
    oh hi this is a deck lol
    </ Paper>
}

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
}));

export default DeckViewer;