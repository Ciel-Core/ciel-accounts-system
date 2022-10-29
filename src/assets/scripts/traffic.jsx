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

export function afterURLChange(callback){
    let location = useLocation();

    createEffect(() => {
        (location.pathname);
        callback();
    });
}

// Check if the current page landing request is valid
export function landingCheck(signedIn){

    const location = useLocation(),
          navigate = useNavigate();

    createEffect(() => {

        // All homepage redirections
        if(location.pathname == '/'){
            // Always redirect new users to the path "/new" from the home page
            if(!signedIn){
                navigate("/new", { replace: true });
            }
        }else if(location.pathname.substring(0, 4) == "/new" || location.pathname.substring(0, 5) == "/user"){
            // Do not allow the user to view pages that fall under
            // the "/new" or "/user" directory when signed in!
            if(signedIn){
                navigate("/", { replace: false });
            }
        }

        // Clean Register data
        if(location.pathname.substring(0, 14) != "/user/register"){
            if(registerData.name.first != undefined || registerData.passwordHash != undefined){
                resetRegisterData();
            }
        }
        if(location.pathname.substring(0, 11) != "/user/login"){
            if(loginData.username != undefined){
                resetLoginData();
            }
        }

        log(location.pathname);

    });

};
