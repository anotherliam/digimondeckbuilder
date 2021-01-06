import { makeStyles } from "@material-ui/core";
import React from "react";

interface Props {
    src: string;
    size: number;
    name: string;
}

const useStyles = makeStyles((theme) => ({
    container: {
        position: "relative",
        cursor: "pointer",
        transition: theme.transitions.create(['transform'], {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.short,
        }),
        "&:hover": {
            transform: "scale(1.05)"
        }
    },
    img: {
        zIndex: 2,
        position: "absolute",
        left: 0,
        top: 0
    },
    bgImg: {
        zIndex: 1
    }
}))

const CardImage: React.FC<Props> = ({ src, size, name }) => {
    const classes = useStyles();
    return <div className={classes.container}>
        <img className={classes.bgImg} src="./back.png" width={size} title={name} />
        <img className={classes.img} src={src} width={size} title={name} />
    </div>
}

export default CardImage;