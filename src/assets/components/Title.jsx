/**
 * 
 * The custom <Title> element
 * 
 **/

export function Title(props){
    document.title = props.children + " | " + window.websiteName;
    return <></>;
}

export default Title;