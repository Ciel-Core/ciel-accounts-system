/**
 * 
 * The custom <SearchBox> element
 * 
 **/

import generalStyles from './../styles/general.module.css';
import { processProps } from './_custom.jsx';

import SearchIcon from './../icons/search.svg';

export function SearchBox(props){
    let basicProps = processProps(props, generalStyles.searchBox)
    return (<div class={generalStyles.searchBoxContainer}>
        <SearchIcon class={generalStyles.searchIcon}/>
        <input ref={props.ref} class={basicProps.class} style={basicProps.style} placeholder={(props.placeholder) ? props.placeholder : "Search"} maxLength={255} />
    </div>);
}

export default SearchBox;