/**
 * 
 * The custom <SearchBox> element
 * 
 **/

import generalStyles from './../styles/general.module.css';
import { createSignal, onMount } from 'solid-js';
import { processProps } from './_custom.jsx';
import { FlexContainer, LoadingSpinner } from './CustomElements.jsx';

import SearchIcon from './../icons/search.svg';

const [results, setResults] = createSignal(undefined);

function updateSearch(container, input, results, resultsLoading, resultsContent){
    let searchTimeout;
    let c = 0;
    input.onkeyup = function(e){
        if([8, 46].includes(e.keyCode) || (!e.ctrlKey && ([13, 32].includes(e.keyCode) ||
            e.key.length == 1))){
            if(searchTimeout != undefined){
                clearTimeout(searchTimeout);
            }
            // Check the input value
            if(input.value.replace(/\s/g, "") != ""){
                searchTimeout = setTimeout(function(){
                    // Get search results
                    resultsLoading.style.display = "none";
                    resultsContent.style.display = null;
                    setResults("The results!");
                }, 500);
                if(resultsLoading.style.display != "" ||
                    results.style.display != "" ||
                    resultsContent.style.display != "none"){
                    resultsLoading.style.display = null;
                    resultsContent.style.display = "none";
                    results.style.display = null;
                    container.dataset.resultsVisible = true;
                }
            }else{
                results.style.display = "none";
                container.dataset.resultsVisible = false;
            }
            // Reset search results
            setResults("...");
        }
    };
    input.onblur = function(){
        if(document.activeElement != results){
            container.dataset.resultsVisible = false;
        }
    };
    input.onfocus = function(){
        if(input.value.replace(/\s/g, "") != ""){
            container.dataset.resultsVisible = true;
        }
    };
    results.onblur = function(){
        if(document.activeElement != input){
            container.dataset.resultsVisible = false;
        }
    };
    results.onfocus = function(){
        if(input.value.replace(/\s/g, "") != ""){
            container.dataset.resultsVisible = true;
        }
    };
}

export function SearchBox(props){
    let basicProps = processProps(props, generalStyles.searchBox),
        searchInput,
        searchContainer,
        searchResults,
        searchResultsLoading,
        searchResultsContent;
    onMount(() => {
        updateSearch(searchContainer, searchInput, searchResults, searchResultsLoading, searchResultsContent);
    });
    return (<div ref={searchContainer} class={generalStyles.searchBoxContainer}>
        <SearchIcon class={generalStyles.searchIcon}/>
        <input ref={searchInput} class={basicProps.class} style={basicProps.style} placeholder={(props.placeholder) ? props.placeholder : "Search"} maxLength={255} />
        <FlexContainer ref={searchResults} class={generalStyles.searchBoxResultsContainer} horizontal style={{display: "none"}} tabindex={0}>
            <FlexContainer ref={searchResultsLoading} style={{display: "none"}}>
                <LoadingSpinner />
            </FlexContainer>
            <FlexContainer ref={searchResultsContent} style={{display: "none"}}>
                {results()}
            </FlexContainer>
        </FlexContainer>
    </div>);
}

export default SearchBox;