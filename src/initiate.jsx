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
import { addConstantRichData, richData } from './assets/scripts/SEO/richData.jsx';
import { fun } from './assets/scripts/_fun.jsx';

let animFinishCallback = [];
export const [showAnimFinished, setSAF] = createSignal(false),
    onLoadAnimationFinished = function(callback){
        if(showAnimFinished()){
            callback();
        }else{
            animFinishCallback.push(callback);
        }
    };
render(() =>{

    // Detect desired view form
    let viewMode = "full";
    if(location.hash == "#in-frame"){
        viewMode = "content-only";
    }

    // Wait for the page's content to finish loading
    const [showContent, setShowContent] = createSignal(false);

    let contentLoadData = {GlobalBar: false, LocalContent: false, UserState: false},
        callbackList = [],
        contentLoadReport = (context, callback = undefined) => {
            if(typeof callback == "function"){
                callbackList.push(callback);
            }
            if(typeof context == "string"){
                contentLoadData[context] = true;
            }
            if(contentLoadData.GlobalBar && contentLoadData.LocalContent &&
                contentLoadData.UserState){
                setShowContent(true);
                while(callbackList.length != 0){
                    (callbackList.pop())();
                }
                document.body.dataset.loaded = true;
            }
        };

    let stopEffect = false;
    createEffect(() => {
        if(!stopEffect && showContent()){
            stopEffect = true;
            setTimeout(function(){
                // Check for "forced dark mode"
                if(isForcedDarkMode()){
                    showDialog("Clarification!", `This website supports dark mode. Your
                                                 browser's 'forced dark mode' could result
                                                 in theme abnormalities!`);
                }
                // Check connection
                checkConnection();
                // Do fun stuff
                fun();
            }, 2000);
        }
    });

    // Console-related warnings
    alertDevMode();
    detectDevTools(function(){
        showDialog("Caution!", `Do NOT paste anything into your console, and don't show your
                               console to anyone you don't trust. Your data could be stolen by
                               attackers should you proceed without knowing what you're doing!`);
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
    createEffect(() => {
        if(showContent() && !showAnimFinished()){
            if(viewMode == "content-only" && typeof parent.contentLoaded == "function"){
                parent.contentLoaded();
            }
            setTimeout(function(){
                // Animations finished
                while(animFinishCallback.length != 0){
                    (animFinishCallback.pop())();
                }
                setSAF(true);
            }, 1500);
        }
    });

    // Manage global rich data
    addConstantRichData(richData.searchAction());

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
                        report={(callback) => { contentLoadReport("LocalContent", callback); }}
                        userDataLoaded={loadedUserData()}
                        viewMode={viewMode}/>
        {
            (viewMode == "full") ?
                <GlobalFooter showAnimationFinished={showAnimFinished()}
                                showContent={showContent()}/>
            :
                undefined
        }
        <Scrollbar report={(callback) => { contentLoadReport(undefined, callback) }}/>
    </Router>;
}, document.body);
