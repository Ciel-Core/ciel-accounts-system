/**
 * 
 * Manage the content of the main help page
 * 
 **/

import style from './../../assets/styles/general.module.css';
import helpStyle from './../../assets/styles/pages/help.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { onCleanup, onMount } from 'solid-js';
import { userData } from './../../assets/scripts/user.jsx';
import { Link, Mark, SearchBox } from './../../assets/components/CustomElements.jsx';

import ExternalIcon from './../../assets/icons/external.svg';

export function ContentBar(props){
    return (<div class={helpStyle.contentBar}>
        <h4 class={helpStyle.title}>{props.title}</h4>
        <ExternalIcon class={`${style.svgButton} ${helpStyle.externalIcon}`}
                onClick={function(){
                    window.open(location.href.replace("/#in-frame", "").replace("#in-frame", ""), '_blank').focus();
                    window.parent.closeNavContent();
                }} />
    </div>);
}

function DefaultFeed(){
    return (<>
        Default feed!
    </>);
}

function SpecializedFeed(){
    let feed = location.pathname.substring("/help/feed/".length);
    feed = feed.substring(0, (feed.indexOf("/") != -1) ? feed.indexOf("/") : feed.length);
    return (<>
        Special "{feed}" feed!
    </>);
}

export default function HelpHome(props){
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
    });
    return <>
        <Title>Help</Title>
        {
            (props.viewMode != "content-only") ?
                (<>
                    <h2 class={style.pageTitle}><Mark>Help</Mark> centre!</h2>
                    <SearchBox placeholder={"Search Help"} />
                </>)
            :
                (<ContentBar title={"Help Centre"} />)
        }
        {
            (location.pathname.indexOf("/help/feed/") == 0) ?
                <SpecializedFeed {...window.sharedData} />
            :
                <DefaultFeed />
        }
    </>;
}