/**
 * 
 *  Manage the traffic of the website
 *  
 **/

import { createEffect } from 'solid-js';
import { useLocation, useNavigate } from "@solidjs/router";
import { log } from './console.jsx';
import { resetRegisterData, registerData } from './pages/registerData.jsx';
import { loginData, resetLoginData } from './pages/loginData.jsx';
import { isSignedIn, isUpdatingUserState } from './user.jsx';

export function afterURLChange(callback, once = false){
    // Note: don't use useLocation, it doesn't work in all contexts!
    let allowCall = true,
        callFunc = function(e){
            if(allowCall){
                if(once){
                    allowCall = false;
                    window.removeEventListener("popstate", callFunc);
                    window.removeEventListener("stateupdate", callFunc);
                }
                callback();
            }
        };
    window.addEventListener("popstate", callFunc);
    window.addEventListener("stateupdate", callFunc);
}

// ["URL", "REDIRECT_URL", REPLACE = true]
const lists = {
    signedInOnly: [
        ["/user/device/setup", "/new"]
    ],
    signedOutOnly: [
        ["/new", "/"],
        ["/user/login", "/"],
        ["/user/challenge", "/"],
        ["/user/register", "/"],
        ["/user/device/auth", "/"]
    ]
};
function loopList(array, callback, navigate){
    array.forEach(function(obj){
        let URL = obj[0],
            REDIRECT_URL = obj[1],
            REPLACE = (obj[2] != undefined) ? obj[2] : true;
        if(location.pathname.substring(0, URL.length) == URL){
            callback(function(){
                navigate(REDIRECT_URL, { replace: REPLACE });
            });
        }
    });
}

// Wait for elements to be defined!
// This is needed in case the user reloads the page and the content needs a bit more time to load!
function waitForElement(elm, callback){
    let element = elm();
    if(element == undefined){
        setTimeout(function(){
            waitForElement(elm, callback);
        }, 100);
    }else{
        callback(element);
    }
}

// Check if the current page landing request is valid
export function landingCheck(){

    const location = useLocation(),
          navigate = useNavigate();
    let searchHash = false;

    createEffect(() => {

        // log(`Updating user state: ${isUpdatingUserState()}\nUser signed in: ${isSignedIn()}`);

        if(!isUpdatingUserState()){

            // All homepage redirections
            if(location.pathname == '/'){
                // Always redirect new users to the path "/new" from the home page
                if(isSignedIn() == false){
                    navigate("/new", { replace: true });
                }
            }else{
                loopList(lists.signedInOnly, function(nav){
                    if(isSignedIn() == false){
                        nav();
                    }
                }, navigate);
                loopList(lists.signedOutOnly, function(nav){
                    if(isSignedIn() == true){
                        nav();
                    }
                }, navigate);
            }
        
            // Clean temporary data
            if(location.pathname.substring(0, 14) != "/user/register"){
                if(registerData.name.first != undefined || registerData.passwordHash != undefined){
                    resetRegisterData();
                }
            }
            if(location.pathname.substring(0, 11) != "/user/login" &&
                location.pathname.substring(0, 12) != "/user/device"){
                if(loginData.username != undefined){
                    resetLoginData();
                }
            }

            // Manage search box mobile navigation
            if(searchHash && location.hash.substring(0, 7) != "#search"){
                waitForElement(() => document.getElementById("searchBox"), function(searchBox){
                    searchBox.dataset.resultsVisible = false;
                    searchBox.children[2].setValue("");
                    searchBox.children[2].blur();
                });
            }else if(location.hash.substring(0, 7) == "#search"){
                searchHash = true;
                waitForElement(() => document.getElementById("searchBox"), function(searchBox){
                    searchBox.dataset.resultsVisible = true;
                    searchBox.children[2].setValue(decodeURIComponent(location.hash.substring(8)));
                    searchBox.children[2].focus();
                });
            }else{
                searchHash = false;
            }

            log(location.pathname);

        }

    });

};
