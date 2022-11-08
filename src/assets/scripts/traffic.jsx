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
import { isSignedIn } from './user.jsx';

export function afterURLChange(callback){
    let location = useLocation();

    createEffect(() => {
        (location.pathname);
        callback();
    });
}

// ["URL", "REDIRECT_URL", REPLACE = true]
const lists = {
    signedInOnly: [
        ["/user/device", "/new"]
    ],
    signedOutOnly: [
        ["/new", "/"],
        ["/user/login", "/"],
        ["/user/challenge", "/"],
        ["/user/register", "/"],
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

// Check if the current page landing request is valid
export function landingCheck(){

    const location = useLocation(),
          navigate = useNavigate();

    createEffect(() => {

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

        log(location.pathname);

    });

};
