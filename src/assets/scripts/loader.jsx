/**
 * 
 * Manage the content loading process
 * 
 **/

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