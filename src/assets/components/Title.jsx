/**
 * 
 * The custom <Title> element
 * 
 **/

export function Title(props){
    document.title = props.children + " | MyApp";
    return <></>;
}

export default Title;