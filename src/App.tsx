import {
  AppBar,
  CircularProgress,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import {
  Menu as MenuIcon
} from "@material-ui/icons";
import clsx from "clsx";
import 'firebase/auth';
import 'firebase/firestore';
import React, { Suspense, useCallback, useState } from "react";
import "./App.css";
import DeckListModal from "./components/DeckListModal";
import DigiDrawer from "./components/Drawer";
import UserStatusBar from "./components/UserStatusBar";
import { DRAWER_WIDTH } from "./config";
import { DeckProvider } from "./deck";
import CardPanel from "./panels/CardPanel";
import DeckPanel from "./panels/DeckPanel";
import { RouteComponentProps, Router } from "@reach/router";
import DeckViewer from "./components/DeckViewer";



const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShifted: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(10),
    marginLeft: theme.spacing(8) + 1,
    marginRight: theme.spacing(2),
    width: `calc(100% - ${theme.spacing(10) + 1}px)`,
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(10) + 1,
      width: `calc(100% - ${theme.spacing(12) + 1}px)`,
    },
    height: "100%",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  pageContainerShifted: {
    marginLeft: theme.spacing(1) + DRAWER_WIDTH,
    width: `calc(100% - ${theme.spacing(3) + DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    flexGrow: 1
  }
}));

const Panels: React.FC<RouteComponentProps> = ({ children }) => <>
  <DeckPanel />
  <CardPanel />
</>;

function App() {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMedScreen = useMediaQuery(theme.breakpoints.up('md'));


  // Handlers
  const handleToggleDrawer = useCallback(
    () => setDrawerOpen((prev) => !prev),
    []
  );

  return (
    <DeckProvider>
      <>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShifted]: drawerOpen,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleToggleDrawer}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: drawerOpen,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>Deckamon{isMedScreen && " - Digimon TCG Deck Builder"}</Typography>
            <Suspense fallback={<CircularProgress />}>
              <UserStatusBar />
            </Suspense>
          </Toolbar>
        </AppBar>


        <DigiDrawer drawerOpen={drawerOpen} handleToggleDrawer={handleToggleDrawer} />

        <div
          className={clsx(classes.pageContainer, {
            [classes.pageContainerShifted]: drawerOpen,
          })}
        >
          <Suspense fallback={<CircularProgress />}>
            <Router>
              <Panels default />
              <DeckViewer path="deck/:deckId" />
            </Router>
          </Suspense>
        </div>
      </>
    </DeckProvider>
  );
}

export default App;

/**

 */
