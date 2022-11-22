/**
 * 
 * Manage the content loading process
 * 
 **/

window.makeRequest = makeRequest;

export function makeRequest(url, callback){
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.send(null);
    request.onloadend = function(){
        if(request.status === 200){
            callback(false, request.responseText);
        }else{
            callback(new Error(`Unable to fetch file (${url})`), undefined);
        }
    };
}

export function loadLibraryJS(src, callback){
    let script = document.createElement('script');
    script.onload = callback;
    script.src = src;
    document.head.appendChild(script);
}

export function loadCBOR(callback){
    if(typeof CBOR != "object"){
        loadLibraryJS('/libraries/cbor.js', callback);
    }else{
        callback();
    }
}

export function loadAES(callback){
    if(typeof CryptoJS != "object"){
        loadLibraryJS('/libraries/aes.js', callback);
    }else{
        callback();
    }
}

export function loadPlatformJS(callback){
    if(typeof platform != "object"){
        loadLibraryJS('/libraries/platform.js', callback);
    }else{
        callback();
    }
}
window.loadPlatformJS = loadPlatformJS;