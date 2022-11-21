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
import BackArrowIcon from './../icons/arrow_back.svg';

const [results, setResults] = createSignal(undefined);

let searchTimeout;
function updateSearchBox(isURLUpdate, container, input, results, resultsLoading, resultsContent){
    // Clear timeout
    if(searchTimeout != undefined){
        clearTimeout(searchTimeout);
    }
    // Update URL on mobile devices
    if(window.mobileView.matches){
        if(input.value.replace(/\s/g, "") != ""){
            if(location.hash.substring(0, 7) != "#search"){
                location.hash = "#search=" + encodeURIComponent(input.value);
            }else{
                window.history.replaceState(undefined, document.title,
                    `${location.pathname}#search=${encodeURIComponent(input.value)}`);
            }    
        }else if(!isURLUpdate){
            if(location.hash.substring(0, 7) != "#search"){
                location.hash = "#search";
            }else{
                window.history.replaceState(undefined, document.title,
                    `${location.pathname}#search`);
            }    
        }
    }
    // Check the input value
    if((input.value.replace(/\s/g, "") != "") &&
            (resultsLoading.style.display != "" ||
            container.dataset.resultsVisible != "true" ||
            resultsContent.style.display != "none")){

        resultsLoading.style.display = null;
        resultsContent.style.display = "none";
        container.dataset.resultsVisible = true;
    }
    // Update search results
    if(input.value.replace(/\s/g, "") != ""){
        searchTimeout = setTimeout(function(){
            resultsLoading.style.display = "none";
            resultsContent.style.display = null;
            // Get search results
            setResults(`Results for "${input.value}"!`);
        }, (isURLUpdate) ? 200 : 600);
    }else if(!window.mobileView.matches){
        container.dataset.resultsVisible = false;
    }
    // Reset search results
    setResults(undefined);
}

function updateSearch(container, input, results, resultsLoading, resultsContent){
    // Manage input interactions
    input.setValue = function(value){
        input.value = value;
        // 'Change' event doesn't work when you change the value of an input field in js!
        updateSearchBox(true, container, input, results, resultsLoading, resultsContent);
    };
    input.oninput = function(){
        updateSearchBox(false, container, input, results, resultsLoading, resultsContent);
    };
    input.onkeyup = function(e){
        if(window.mobileView.matches && e.keyCode == 13){
            input.blur();
        }
    };

    container.hideResults = function(){
        container.dataset.resultsVisible = false;
        resultsLoading.style.display = "none";
        resultsContent.style.display = "none";
    };

    // Manage other interactions
    input.onblur = function(){
        // For some reason, the code breaks without the timeout function!
        setTimeout(function(){
            if(!window.mobileView.matches && document.activeElement != results){
                container.hideResults();
            }
        }, 0);
    };
    input.onfocus = function(){
        if(input.value.replace(/\s/g, "") != "" || window.mobileView.matches){
            container.dataset.resultsVisible = true;
            if(window.mobileView.matches && location.hash.substring(0, 7) != "#search"){
                location.hash = "#search";
            }
        }
    };
    results.onblur = function(){
        setTimeout(function(){
            if(!window.mobileView.matches && document.activeElement != input){
                container.hideResults();
            }
        }, 0);
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
    return (<div id="searchBox" ref={searchContainer} class={generalStyles.searchBoxContainer} data-results-visible={false} unselectable>
        <SearchIcon class={generalStyles.searchIcon}/>
        <BackArrowIcon class={generalStyles.backIcon} onClick={() => {
                if(location.hash.substring(0, 7) == "#search"){
                    history.back();
                }else{
                    searchContainer.dataset.resultsVisible = false;
                }
            }}/>
        <input ref={searchInput} class={basicProps.class} style={basicProps.style} placeholder={(props.placeholder) ? props.placeholder : "Search"} maxLength={255} />
        <FlexContainer ref={searchResults} class={generalStyles.searchBoxResultsContainer} horizontal tabindex={0}>
            <FlexContainer ref={searchResultsLoading} style={{display: "none"}}>
                <LoadingSpinner class={generalStyles.searchBoxLoading} />
            </FlexContainer>
            <FlexContainer ref={searchResultsContent} class={generalStyles.searchBoxResultsContent}>
                {results()}
            </FlexContainer>
        </FlexContainer>
    </div>);
}

export default SearchBox;