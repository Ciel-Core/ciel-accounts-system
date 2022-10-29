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