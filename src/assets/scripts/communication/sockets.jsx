/**
 * 
 * Manage the communication with the server and client
 * 
 **/

import { log, throwError } from "./../console.jsx";

// Socket message structure
export function StructuredMessage(channel, data){
    if(typeof channel != "string"){
        throwError(new Error("Illegal channel name!"));
    }else{
        this.channel = channel;
        this.data = data;
    }
}
StructuredMessage.parse = function(string){
    let msg;
    try{
        msg = JSON.parse(string);
    }catch{
        throwError(new Error("Illegal socket 'StructuredMessage' format!"));
    }
    if(typeof msg.channel != "string"){
        throwError(new Error("Illegal socket 'StructuredMessage' channel!"));
    }
    return new StructuredMessage(msg.channel, msg.data);
};

// Open socket connection
// NOTE: only allow one active socket at a time!
// NOTE: make sure to share the socket object with iframes
let socket = undefined;
window.activeWebSocket = undefined;
export function openSocket(pathname = "/"){
    if(parent.activeWebSocket != undefined && parent.activeWebSocket.url == `wss://${location.host}${pathname}`){
        socket = parent.activeWebSocket;
        window.activeWebSocket = socket;
    }else if(socket == undefined && parent.activeWebSocket == undefined){
        socket = new WebSocket(`wss://${location.host}}${pathname}`);
        window.activeWebSocket = socket;

        socket.onopen = function(e){
            log("Socket", "connection open");
        };

        socket.onmessage = function(event){
            log("Socket", `Data received from server!`, event.data);
            let message = StructuredMessage.parse(event.data);
            channelsCallbacks[channel].forEach(callback => callback(message));
        };

        socket.onclose = function(event){
            if (event.wasClean) {
                log("Socket", `Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            }else{
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
                log("Socket", 'Connection died');
            }
        };

        socket.onerror = function(error) {
            log("Socket", error);
        };
    }else{
        throwError(new Error("Can't open more than one socket at a time!"));
    }
}

// Send socket data
export function sendMessage(data){
    if(data instanceof StructuredMessage){
        socket.send(data);
    }else{
        throwError(new Error("Only structured messages are allowed to be sent through!"));
    }
}

// Listen to socket channel messages
let channelsCallbacks = {}
export function listen(channel, callback){
    // Define channel
    if(channelsCallbacks[channel] == undefined){
        channelsCallbacks[channel] = [];
    }
    // Add callback
    channelsCallbacks[channel].push(callback);
}