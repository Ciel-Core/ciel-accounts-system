/**
 * 
 * Manage the communication with the server and client (server-to-client only)
 * 
 **/

import { awaitConnection, isOnline } from "./../internetConnection.jsx";
import { showDialog } from "./../../components/Dialog.jsx";
import { log, throwError } from "./../console.jsx";

let eventSource = undefined;
window.activeEventSource = undefined;
window.restrictChildrenEventSource = true;

let failedAttempts = 0,
    closeDialogVisible = false;
function closeDialog(allowWithoutConn = true){
    if(!closeDialogVisible){
        closeDialogVisible = true;
        showDialog("Something went wrong!", "We couldn't connect to the server for live updates!", [
            (allowWithoutConn) ? ["Ok", function(dialog, remove){
                closeDialogVisible = false;
                remove();
            }] : undefined, ["Retry", function(dialog, remove){
                location.reload();
            }]
        ]);
    }
}
function errorDialog(thisObj, args){
    closeConnection();
    if(!closeDialogVisible){
        // Check failed attempts
        if(++failedAttempts > 3){
            closeDialog();
        }else{
            // Do a silent attempt to reopen connection! (max limit is 3)
            setTimeout(() => openConnection.apply(thisObj, args), 3000);
        }
    }
}

// Open connection
let callbackDone = false;
export function openConnection(successCallback, zeroTS = false){
    let callback = function(){
            if(!callbackDone){
                callbackDone = true;
                successCallback();
            }
        };
    if(!isOnline()){
        awaitConnection(() => openConnection(successCallback, true));
        return;
    }
    if(!window.EventSource){
        log("Server Events", "Browser doesn't support server events!");
        return;
    }
    // Check if parent has an active connection
    if(window.parent.activeEventSource != undefined){
        eventSource = window.parent.activeEventSource;
    }else if(window.opener != undefined && window.opener.activeEventSource != undefined){
        eventSource = window.opener.activeEventSource;
    }
    window.activeEventSource = eventSource;
    // Check if the event source is closed!
    if(eventSource == undefined || eventSource.readyState == 2){
        // Open connection
        if(eventSource != undefined){
            eventSource.close();
        }
        callbackDone = false;
        eventSource = undefined;
        eventSource = new EventSource("/comm/events/init.php" + ((zeroTS) ? "?zero=1" : ""));
        window.activeEventSource = eventSource;

        if(eventSource instanceof EventSource){

            // Detect errors
            eventSource.onerror = (error) => {
                errorDialog(this, arguments);
                log("Server Events", "EventSource failed", error);
                throwError(error);
            };

            // Wait for connection to open!
            eventSource.onopen = (event) => {
                // Success callback!
                callback();

                // Close connection when inactive
                // To-do: Make sure to include other opened windows in this!
                {
                    let closedConnection = false,
                        timeout = undefined;
                    document.onvisibilitychange = function(){
                        if(document.hidden){
                            timeout = setTimeout(function(){
                                if(document.hidden){
                                    closedConnection = true;
                                    closeConnection();
                                }else{
                                    closedConnection = false;
                                }
                            }, 60000);
                        }else{
                            clearTimeout(timeout);
                            if(closedConnection){
                                openConnection(successCallback, true);
                            }
                            closedConnection = false;
                        }
                    };
                }
            };
        }
    }else{
        log("Server Events", "Server events connection already open!");
    }

    // Listen to server-{*} events!
    if(!watchList.includes("server-error")){
        listenTo("server-error", function(e){
            errorDialog(this, arguments);
        });
    }
    if(!watchList.includes("server-open")){
        listenTo("server-open", function(e){ });
    }
    if(!watchList.includes("server-close")){
        listenTo("server-close", function(e){
            // Do not attempt to reconnect automatically!
            // This event means that the server closed by design!
            closeConnection();
            // If the data is set to 1, this means that the reason the server closed is
            // because there's an error in the user's data!
            closeDialog(e.data === "0");
        });
    }
    if(!watchList.includes("server-test")){
        listenTo("server-test", function(e){ });
    }

    // Success callback (context with an already-open connection)
    if(eventSource.readyState == 1){
        callback();
    }
    
}

// Close current connection
export function closeConnection(){
    if((!window.restrictEventSource ||
        (window.opener != undefined && !window.opener.restrictChildrenEventSource)) &&
        (window.parent == window) && window.opener == undefined){
        if(eventSource != undefined){
            eventSource.close();
            eventSource = undefined;
            window.activeEventSource = undefined;
            while(watchList.length != 0){
                watchList.pop();
            }
            log("Server Events", "Server events connection has been closed!");
        }else{
            log("Server Events", "No open server events connection found!");
        }
    }
}

// Close connection when website is about to unload
window.onbeforeunload = closeConnection;
window.onunload = closeConnection;

// Listen to events
let watchList = [];
export function listenTo(channel, callback){
    watchList.push(channel);
    window.wl = watchList;
    eventSource.addEventListener(channel, function(e){
        log("ServerEvents", "event => " + channel, e);
        callback(e);
    });
}
export function isListeningTo(channel){
    return watchList.includes(channel);
}