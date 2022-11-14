/**
 * 
 * Manage the website's colour scheme!
 * 
 **/

import { render } from "solid-js/web";

let changeCallback = event => {
    document.documentElement.dataset.colorScheme = event.matches ? "dark" : "light";
    localStorage.setItem("last-color-scheme", document.documentElement.dataset.colorScheme)
}, matchMedia = undefined;

export function isForcedDarkMode(){
    let elm;
    render(() => (<div ref={elm} style={{
        display: "none",
        "background-color": "canvas",
        "color-scheme": "light"
    }}></div>), document.body);
    // If the computed style is not white then the page is in Auto Dark Theme.
    let isAutoDark = getComputedStyle(elm).backgroundColor != 'rgb(255, 255, 255)';
    elm.remove();
    return isAutoDark;
}

export function updateColorScheme(preference){ // 0 - system, 1 - light, 2 - dark
    if(matchMedia != undefined){
        matchMedia.removeEventListener("change", changeCallback);
        matchMedia = undefined;
    }
    if(preference == 1){
        document.documentElement.dataset.colorScheme = "light";
    }else if(preference == 2){
        document.documentElement.dataset.colorScheme = "dark";
    }else{
        matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
        document.documentElement.dataset.colorScheme = matchMedia.matches ? "dark" : "light";
        matchMedia.addEventListener('change', changeCallback);
    }
    localStorage.setItem("last-color-scheme", document.documentElement.dataset.colorScheme)
}