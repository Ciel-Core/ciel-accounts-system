/**
 * 
 * Manage console logs
 * 
 **/

import { showDialog } from "../components/Dialog";

export const devHash = "#activate-developer-mode";

export const isDevMode = (import.meta.env.MODE == "development" || location.hash == devHash);

export function throwError(error){
    if(isDevMode){
        throw error;
    }
}

export function log() {
    // Check 'https://vitejs.dev/guide/env-and-mode.html#modes'
    if (isDevMode) {
        console.log.apply(null, [`%c[${arguments[0]}]`, 'color: green; font-weight: 800;', ...[...arguments].slice(1)]);
    }
}

export function alertDevMode(){
    if(location.hash == devHash){
        location.hash = "";
    }
    if(isDevMode && import.meta.env.MODE != "development"){
        showDialog("Caution!", "Developer mode has been activated. If you did not intend to use developer mode, then it is most likely that someone is trying to trick you into giving them access to your data/account. Please refresh the page to exit developer mode!");
    }
}

export function detectDevTools(callback) {
    if (!isDevMode && !window.noDevToolsDetect) {
        let userWarned = false,
            dDevTool = (allow, noConsoleLog = false) => {
                if(!userWarned){
                    if(!noConsoleLog){
                        console.clear();
                        console.log('%cStop!', 'color: crimson; font-size: 46px; font-weight: 800;');
                        console.log('%cDo NOT paste any code or text into the console!', 'color: orange; font-size: 24px;');
                        console.log('%cYour account, data, and privacy could be compromised should you allow other people to access your console or paste code/text into it!', 'font-size: 16px;');
                    }

                    if (isNaN(+allow)) allow = 100;
                    var start = +new Date();
                    debugger;
                    var end = +new Date();
                    if (isNaN(start) || isNaN(end) || end - start > allow) {
                        callback();
                        userWarned = true;
                        window.removeEventListener('load', dDevTool);
                        window.removeEventListener('resize', ldDevTool);
                        window.removeEventListener('mousemove', ldDevTool);
                        window.removeEventListener('focus', dDevTool);
                        window.removeEventListener('blur', dDevTool);
                    }
                }
            },
            ldDevTool = (allow) => {
                dDevTool(allow, true);
            };
        window.addEventListener('load', dDevTool);
        window.addEventListener('resize', ldDevTool);
        window.addEventListener('mousemove', ldDevTool);
        window.addEventListener('focus', dDevTool);
        window.addEventListener('blur', dDevTool);
        dDevTool();
    }
}