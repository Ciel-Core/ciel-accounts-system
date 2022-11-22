/**
 * 
 * The custom <Title> element
 * 
 **/

export function Title(props){
    if(typeof props.children == "string" && props.children.replace(/\s/g, "") != ""){
        document.title = props.children + " | " + import.meta.env.VITE_NAME;
    }else{
        document.title = import.meta.env.VITE_NAME;
    }
    return <></>;
}

export default Title;