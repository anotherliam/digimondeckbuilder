import React from "react";
import { IconButton, makeStyles, Drawer, useTheme, Button, Divider, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  SaveAlt as SaveAltIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import { DRAWER_WIDTH } from "../config";
import { useDeckHelpers } from "../deck";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  drawerToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

interface Props {
  drawerOpen: boolean;
  handleToggleDrawer: () => void;
}

const DigiDrawer: React.FC<Props> = ({ drawerOpen, handleToggleDrawer }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { exportAsText } = useDeckHelpers();
  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: drawerOpen,
        [classes.drawerClose]: !drawerOpen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen,
        }),
      }}
    >
      <div className={classes.drawerToolbar}>
        <IconButton onClick={handleToggleDrawer}>
          {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem button onClick={exportAsText}>
            <ListItemIcon><SaveAltIcon /></ListItemIcon>
            <ListItemText primary={"Export"} />
        </ListItem>
        </List>
    </Drawer>
  );
};

export default DigiDrawer;