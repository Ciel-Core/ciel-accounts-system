/**
 * 
 * The custom <Title> element
 * 
 **/

export function Title(props){
    if(typeof props.children == "string" && props.children.replace(/\s/g, "") != ""){
        document.title = props.children + " | " + window.websiteName;
    }else{
        document.title = window.websiteName;
    }
    return <></>;
}

export default Title;