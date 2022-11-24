/**
 * 
 * Manage the communication with the server and client (server-to-client only)
 * 
 **/

import { showDialog } from "./../../components/Dialog.jsx";
import { log, throwError } from "./../console.jsx";

let eventSource = undefined;
window.activeEventSource = undefined;

let failedAttempts = 0;
function errorDialog(successCallback){
    eventSource.close();
    eventSource = undefined;
    window.activeEventSource = undefined;
    // Check failed attempts
    if(++failedAttempts > 5){
        showDialog("Something went wrong!", "We couldn't connect to the server for live updates!", [
            ["Ok", function(dialog, remove){
                remove();
            }], ["Retry", function(dialog, remove){
                remove();
                location.reload();
            }]
        ]);
    }else{
        // Do a silent attempt to reopen connection! (max limit is 5)
        setTimeout(() => openConnection(successCallback), 3000);
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

            // Listen for any messages
            eventSource.onmessage = (event) => {
                log("Server Events", event);
            };

            // Wait for connection to open!
            eventSource.onopen = (event) => {
                // Listen to server errors!
                listenTo("server-error", function(e){
                    errorDialog(successCallback);
                });

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

// Listen to events
export function listenTo(channel, callback){
    eventSource.addEventListener(channel, function(e){
        log("ServerEvents", "channel => " + channel, e);
        callback(e);
    });
}