import { Button, Dialog, DialogTitle, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useState } from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import { useAuth, useUser } from "reactfire";



const UserStatusBar = () => {

    const user = useUser();
    const auth = useAuth();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const handleCloseLoginModal = () => setLoginModalOpen(false);
    const handleOpenLoginModal = () => setLoginModalOpen(true);

    const uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            {
            provider: useAuth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true,
            fullLabel: "Continue with Email"
        }, {provider: useAuth.GoogleAuthProvider.PROVIDER_ID, 
            fullLabel: "Continue with Google"}],
        callbacks: {
          // Avoid redirects after sign-in.
          signInSuccessWithAuthResult: () => false
        }
    }

    // If logged in
    if (user && user.data && user.hasEmitted && user.status === "success") {
        return (
            <>
                {!isSmallScreen && <Typography>{user.data.email}</Typography>}
                <Button color="inherit" onClick={() => auth.signOut()}>Sign Out</Button>
            </>
        )
    }

    // If not logged in
    return (<>
        <Button color="inherit" onClick={handleOpenLoginModal}>Sign In \ Sign Up</Button>
        <Dialog fullScreen={isSmallScreen} open={loginModalOpen} onClose={handleCloseLoginModal}>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </Dialog>
    </>)
}

export default UserStatusBar;