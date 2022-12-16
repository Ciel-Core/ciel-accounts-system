/**
 * 
 * Manage all rich-data-related functions
 * 
 **/

import { render } from "solid-js/web";

// Clear old rich data
let richDataElms = [],
    clearRichData = () => {
        while(richDataElms.length != 0){
            let elm = richDataElms.pop();
            elm.remove();
        }
    };

// Inject rich data into the page dynamically
function injectRichData(data, constant = false){
    let elm;
    render(() => (<script ref={elm} type={"application/ld+json"}>
        {JSON.stringify(data)}
    </script>), document.head);
    if(!constant){
        richDataElms.push(elm);
    }
}

// "SearchAction"
// https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
export let richData = {
    searchAction(path = "/", url = location.host){
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": `https://${url}/`,
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `https://${url}${path}#search={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            }
        }
    }
};

// Rich data functions
export function addRichData(clear, ...data){
    if(clear){
        clearRichData();
    }
    for(let i = 0; i < data.length; i++){
        injectRichData(data[i]);
    }
}
export function addConstantRichData(...data){
    for(let i = 0; i < data.length; i++){
        injectRichData(data[i], true);
    }
}
export { clearRichData };