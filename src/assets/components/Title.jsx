/**
 * 
 * The custom <Title> element
 * 
 **/

export function Title(props){
    setTitle(props.children);
    return <></>;
}

export function setTitle(title){
    if(typeof title == "string" && title.replace(/\s/g, "") != ""){
        document.title = title + " | " + import.meta.env.VITE_NAME;
    }else{
        document.title = import.meta.env.VITE_NAME;
    }
}

export default Title;