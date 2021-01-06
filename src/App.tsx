import React, { useCallback, useReducer, useState } from "react";
import "./App.css";
import {
  AppBar,
  CardHeader,
  Container,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  SelectProps,
  styled,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  SearchRounded,
  Menu as MenuIcon,
} from "@material-ui/icons";
import CardPanel from "./panels/CardPanel";
import DeckPanel from "./panels/DeckPanel";
import FilterPanel from "./panels/FilterPanel";
import { filterReducer, getFilters, initialFilterState } from "./Filters";
import { CardDetails } from "./Cards";
import { clamp } from "lodash";
import { DeckProvider } from "./deck";
import DigiDrawer from "./components/Drawer";
import { DRAWER_WIDTH } from "./config";

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
}));

function App() {
  const classes = useStyles();
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);

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
            <Typography variant="h6">Digimon Card Viewer</Typography>
          </Toolbar>
        </AppBar>

        <DigiDrawer drawerOpen={drawerOpen} handleToggleDrawer={handleToggleDrawer} />

        <div
          className={clsx(classes.pageContainer, {
            [classes.pageContainerShifted]: drawerOpen,
          })}
        >
          <DeckPanel />
          <CardPanel />
        </div>
      </>
    </DeckProvider>
  );
}

export default App;

/**

 */
