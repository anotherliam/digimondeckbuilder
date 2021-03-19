import { CircularProgress, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React, { Suspense, useState } from "react";
import { AuthCheck, useAuth, useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { formatDistance } from "date-fns";
import { CloudSavedDeck, useDeckHelpers } from "../deck";

const getTimeSinceDeck = (deck: any) => formatDistance(1000 * deck.mtime.seconds, new Date(), { addSuffix: true });

interface DeckListModalProps {
    open: boolean;
    handleClose: () => void;
}

interface ModalcontentsProps {
    handleClose: () => void;
}

const ModalContents: React.FC<ModalcontentsProps> = ({ handleClose }) => {
    const user = useUser();

    const [error, setError] = useState<null | string>(null);

    const { loadCloudDeck } = useDeckHelpers();

    const decks = useFirestore()
        .collection("decks")
        .where("user", "==", user.data.uid)
        .limit(10)
    const { status, data } = useFirestoreCollectionData(decks, { idField: "_id" });
    const handleClick = (deck: CloudSavedDeck) => {
        if (loadCloudDeck(deck)) {
            console.log("loaded deck");
            handleClose();
        } else {
            setError(`Deck seems corrupted? (id: ${deck._id})`);
        }
    };

    if (error !== null) {
        return <Typography>{error}</Typography>
    }

    if (status === "loading" || !data) {
        return <CircularProgress />
    }
    return (<List>
        {data.map((deck) => (
            <ListItem button onClick={() => handleClick(deck as CloudSavedDeck)}>
                <ListItemText primary={deck.name as string} secondary={getTimeSinceDeck(deck)} />
            </ListItem>
        ))
        }
    </List>);
}

const DeckListModal: React.FC<DeckListModalProps> = ({ open, handleClose }) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
        

    // If not logged in
    return (<>
        <Dialog fullScreen={isSmallScreen} open={open} onClose={handleClose}>
            <DialogTitle>Saved Decks</DialogTitle>
            <DialogContent>
                <Suspense fallback={"Loading..."}>
                    <AuthCheck fallback={<p>Not logged in</p>}>
                        <ModalContents handleClose={handleClose} />
                    </AuthCheck>
                </Suspense>
            </DialogContent>
        </Dialog>
    </>)
}


export default DeckListModal;