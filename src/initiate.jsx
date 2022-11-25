/**
 *
 * The website's loading initiator
 *
 **/

// Step 1: Ready the render function
/* @refresh reload */
import { render } from 'solid-js/web';
import { createEffect, createSignal } from "solid-js";

// Step 2: Ready the router
import { Router } from "@solidjs/router";

// Step 3: Check the user's status and get the relavent data:
//         * The user is not signed in?
//              -> Get the default user profile data!
//              -> Initiate the login/sign up process
//              -O Stop untill further notice!
//         * The user is signed in?
//              -> Get the user's relative data
//              -> Initiate the process of loading the main page content!
//              -O Stop untill further notice!
import { updateUserState, userData } from './assets/scripts/user.jsx';

// Step 4: Update the components that are relavent to the user's data
import { updateAccentColor, updateColorScheme } from './assets/scripts/theme.jsx';

// Step 5: Import the required components
import GlobalBar from './assets/components/GlobalBar.jsx';
import GlobalFooter from './assets/components/GlobalFooter.jsx';
import LocalContent from './assets/components/LocalContent.jsx';
import Scrollbar from './assets/components/ScrollBar.jsx';
import { showDialog } from './assets/components/CustomElements.jsx';
import { isForcedDarkMode } from './assets/scripts/theme.jsx';
import { checkConnection } from './assets/scripts/internetConnection.jsx';
import { detectDevTools, alertDevMode } from './assets/scripts/console.jsx';

render(() =>{

    // Detect desired view form
    let viewMode = "full";
    if(location.hash == "#in-frame"){
        viewMode = "content-only";
    }

    // Wait for the page's content to finish loading
    const [showContent, setShowContent] = createSignal(false);

    let contentLoadData = {GlobalBar: false, LocalContent: false, UserState: false},
        contentLoadReport = (context) => { // context - "GlobalBar", "LocalContent"
            contentLoadData[context] = true;
            if(contentLoadData.GlobalBar && contentLoadData.LocalContent && contentLoadData.UserState){
                // Must run this when the user's basic info are aquired from the server and fully loaded!
                // setTimeout(() => setShowContent(true), 1500); // TMP
                setShowContent(true);
                document.body.dataset.loaded = true;
            }
        };

    let stopEffect = false;
    createEffect(() => {
        if(!stopEffect && showContent()){
            stopEffect = true;
            setTimeout(function(){
                if(isForcedDarkMode()){
                    showDialog("Clarification!", "This website supports dark mode. Your browser's 'forced dark mode' could result in theme abnormalities!", [["Ok", function(dialog, remove){remove()}]]);
                }
                // showDialog("Demo", "No backend!");
                checkConnection();
            }, 1800);
        }
    });

    // Console-related warnings
    alertDevMode();
    detectDevTools(function(){
        showDialog("Caution!", "Do NOT paste anything into your console, and don't show your console to anyone you don't trust. Your data could be stolen by attackers should you proceed without knowing what you're doing!");
    });

    // Update the user's state and profile
    const [loadedUserData, setLUD] = createSignal(false);
    updateUserState(() => {
        contentLoadReport("UserState");
        setLUD(true);
        // Update colour scheme
        createEffect(() => {
            updateColorScheme(userData().visual.preferredColorScheme);
            updateAccentColor(userData().visual.accentColor);
        });
    });

    // Detect when the content animation is finished
    const [showAnimFinished, setSAF] = createSignal(false);
    createEffect(() => {
        if(showContent() && !showAnimFinished()){
            if(viewMode == "content-only" && typeof parent.contentLoaded == "function"){
                parent.contentLoaded();
            }
            setTimeout(function(){
                setSAF(true);
            }, 1500);
        }
    });

    // Return the global page content
    return <Router>
        {
            (viewMode == "full") ?
                <GlobalBar userProfile={userData().personal.profilePicture}
                            showAnimationFinished={showAnimFinished()} showContent={showContent()}
                            report={() => { contentLoadReport("GlobalBar"); }}/>
            :
                contentLoadReport("GlobalBar")
        }
        <LocalContent userData={userData()} showAnimationFinished={showAnimFinished()}
                        showContent={showContent()}
                        report={() => { contentLoadReport("LocalContent"); }}
                        userDataLoaded={loadedUserData()}
                        viewMode={viewMode}/>
        {
            (viewMode == "full") ?
                <GlobalFooter showAnimationFinished={showAnimFinished()} showContent={showContent()}/>
            :
                undefined
        }
        <Scrollbar/>
    </Router>;
}, document.body);
