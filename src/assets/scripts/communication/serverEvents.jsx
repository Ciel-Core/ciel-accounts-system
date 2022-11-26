/**
 * 
 * Manage the communication with the server and client (server-to-client only)
 * 
 **/

import { showDialog } from "./../../components/Dialog.jsx";
import { log, throwError } from "./../console.jsx";

let eventSource = undefined;
window.activeEventSource = undefined;

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
function errorDialog(successCallback){
    closeConnection();
    if(!closeDialogVisible){
        // Check failed attempts
        if(++failedAttempts > 3){
            closeDialog();
        }else{
            // Do a silent attempt to reopen connection! (max limit is 3)
            setTimeout(() => openConnection(successCallback), 3000);
        }
    }
}

// Open connection
export function openConnection(successCallback){
    if(!window.EventSource){
        log("Server Events", "Browser doesn't support server events!");
    }
    // Check if parent has an active connection
    else if(parent.activeEventSource != undefined){
        eventSource = parent.activeEventSource;
    }
    // Check if the event source is closed!
    else if(eventSource == undefined || eventSource.readyState == 2){
        // Open connection
        if(eventSource != undefined){
            eventSource.close();
        }
        eventSource = undefined;
        eventSource = new EventSource("/comm/events/init.php");
        window.activeEventSource = eventSource;

        if(eventSource != undefined){

            // Detect errors
            eventSource.onerror = (error) => {
                errorDialog(successCallback);
                log("Server Events", "EventSource failed", error);
                throwError(error);
            };

            // Wait for connection to open!
            eventSource.onopen = (event) => {
                // Listen to server-{*} events!
                listenTo("server-error", function(e){
                    errorDialog(successCallback);
                });
                listenTo("server-open", function(e){ });
                listenTo("server-close", function(e){
                    // Do not attempt to reconnect automatically!
                    // This event means that the server closed by design!
                    closeConnection();
                    // If the data is set to 1, this means that the reason the server closed is
                    // because there's an error in the user's data!
                    closeDialog(e.data === "0");
                });
                listenTo("server-test", function(e){ });

                // Success callback!
                successCallback(event);
            };
        }
    }else{
        log("Server Events", "Server events connection already open!");
    }
}

// Close current connection
export function closeConnection(){
    if(!window.restrictEventSource){
        if(eventSource != undefined){
            eventSource.close();
            eventSource = undefined;
            window.activeEventSource = undefined;
        }else{
            log("Server Events", "No open server events connection found!");
        }
    }
}

// Close connection when website is about to unload
window.onbeforeunload = closeConnection;
window.onunload = closeConnection;

// Listen to events
export function listenTo(channel, callback){
    eventSource.addEventListener(channel, function(e){
        log("ServerEvents", "event => " + channel, e);
        callback(e);
    });
}