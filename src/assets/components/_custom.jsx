/**
 *
 * Manage functions that help with the creation of custom elements
 *
**/

export function processProps(props, ...classNames){
    return {
        class: `${(function(){
            let className = "";
            classNames.forEach(function(arg){
                if(typeof arg == "string" && arg.replace(/\s/ig, "") != "")
                    className += (arg + " ");
            });
            return className;
        })()}${(props.class ? " " + props.class : "")}`,
        style: props.style ? props.style : {}
    };
}

export function watchSticky(elm){
    var observer = new IntersectionObserver(function(entries) {
        if(entries[0].intersectionRatio === 0)
            elm.dataset.sticky = true;
        else if(entries[0].intersectionRatio === 1)
            elm.dataset.sticky = false;
    }, { threshold: [0,1] });
    observer.observe(elm);
    var observer = new IntersectionObserver( 
        ([e]) => elm.dataset.sticky = e.intersectionRatio < 1,
    {threshold: [1]});
    observer.observe(elm);
}

let scrollCallback = function(elm, limit){
    elm.dataset.sticky = (elm.getBoundingClientRect().top < limit);
};
export function watchStickyContent(elm, limit){
    window.addEventListener("scroll", () => scrollCallback(elm, limit));
}
export function watchStickyContentRemove(elm, limit){
    window.removeEventListener("scroll", () => scrollCallback(elm, limit));
}