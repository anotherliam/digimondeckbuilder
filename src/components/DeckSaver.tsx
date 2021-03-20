import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { AuthCheck, useUser } from "reactfire";
import { DeckPrivacyStatuses, DeckTypes, useDeck, useDeckHelpers } from "../deck";


const DeckSaver = () => {
    const [deck] = useDeck();
    const [pending, setPending] = useState(false);
    const [name, setName] = useState("");
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const { saveDeckToCloud, changeDeckPrivacy } = useDeckHelpers();
    const user = useUser();

    const handleSave = async () => {
        setSaveModalOpen(false);
        setPending(true);
        try { 
            const res = await saveDeckToCloud(name, user.data);
        } catch (e) {
            console.warn(e);
        }
        setTimeout(() => setPending(false), 500);
    }

    const handleSaveNewDeck = () => {
        setName("");
        setSaveModalOpen(true);
    }

    const handleSharePublicDeck = async () => {
        setPending(true);
        try {
            const res = await changeDeckPrivacy(user.data);
        } catch (e) {
            console.warn(e);
        }
        setTimeout(() => setPending(false), 500);
    }

    const deckUrl = deck.type === DeckTypes.Persisted ? `${window.location.origin}/deck/${deck.cloudId}` : "";

    return (<AuthCheck fallback={null}>
        {
            deck.type === DeckTypes.Temporary ? (
                <>
                <Typography>Deck is local only</Typography>
                <Button disabled={pending} onClick={handleSaveNewDeck}>{pending ? "Saving..." : "Save to cloud"}</Button>
                </>
            ) : (
                <Button disabled={pending || !deck.dirty} onClick={handleSave}>{pending ? "Saving..." : !deck.dirty ? "Up to date" : "Save"}</Button>
            )
        }
        {deck.type === DeckTypes.Persisted && (
            deck.privacy === DeckPrivacyStatuses.Private ? (
                <>
                    <Typography>Deck is private</Typography>
                    <Button disabled={pending} onClick={handleSharePublicDeck}>Share Publically</Button>
                </>
            ) : (
                <>
                <Typography>Deck is public. Shareable link to deck: <a href={deckUrl}>{deckUrl}</a></Typography>
                </>
            )
        )}
        <Dialog open={saveModalOpen} onClose={() => setSaveModalOpen(false)}>
            <DialogTitle>Save Deck to Cloud</DialogTitle>
            <DialogContent>
                <Input value={name} onChange={(ev) => setName(ev.target.value)}></Input>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setSaveModalOpen(false)} color="primary">Cancel</Button>
            <Button disabled={name.length <= 0} onClick={handleSave} color="primary">Save Deck</Button>
            </DialogActions>
        </Dialog>
    </AuthCheck>)
}

export default DeckSaver;