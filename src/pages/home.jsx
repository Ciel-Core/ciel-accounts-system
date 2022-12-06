/**
 * 
 * Manage the content of the main page
 * 
 **/

import style from './../assets/styles/general.module.css';
import homeStyle from './../assets/styles/pages/home.module.css';

import { Title } from './../assets/components/Title.jsx';
import { createEffect, createSignal, For, lazy, onCleanup, onMount } from 'solid-js';
import { userData } from './../assets/scripts/user.jsx';
import {
    FlexContainer, LoadingSpinner, Mark, NavBar, SearchBox
} from './../assets/components/CustomElements.jsx';
import { useLocation, useNavigate } from '@solidjs/router';

function sectionContent(location, done){
    if(location == "/"){
        return lazy(() => {
            let r = import(`./home/main.jsx`);
            done();
            return r;
        });
    }else if(location == "/home/personal"){
        return lazy(() => {
            let r = import(`./home/personal.jsx`);
            done();
            return r;
        });
    }else if(location == "/home/privacy"){
        return lazy(() => {
            let r = import(`./home/privacy.jsx`);
            done();
            return r;
        });
    }else if(location == "/home/security"){
        return lazy(() => {
            let r = import(`./home/security.jsx`);
            done();
            return r;
        });
    }else if(location == "/home/sharing"){
        return lazy(() => {
            let r = import(`./home/sharing.jsx`);
            done();
            return r;
        });
    }else if(location == "/home/financial"){
        return lazy(() => {
            let r = import(`./home/financial.jsx`);
            done();
            return r;
        });
    }else{
        done();
        return <div>Something went wrong!</div>;
    }
}

function isSectionVisable(parent, section){
    let sectionClient = section.getBoundingClientRect(),
        parentClient = parent.getBoundingClientRect();
    return (Math.abs(sectionClient.x - parentClient.x) < ((parentClient.width / 2) - 80));
}
let allowResize = true,
    allowScrollNav = false;
function Sections(props){
    let navigate = useNavigate(),
        sections = (<div ref={props.ref} class={homeStyle.sectionsContainer} {...props}>
            {props.children}
        </div>),
        timeout = undefined,
        touchStarted = false,
        allowScroll = () => {
            if(touchStarted){
                touchStarted = false;
                timeout = setTimeout(() => sections.dataset.blockCodedScroll = false, 200);
            }
        },
        blockScroll = () => {
            touchStarted = true;
            if(!allowScrollNav){
                allowScrollNav = true;
                sections.onscroll();
            }
            clearTimeout(timeout);
            sections.dataset.blockCodedScroll = true;
        };
    onCleanup(() => {
        window.removeEventListener("touchend", allowScroll);
        window.removeEventListener("touchcancel", allowScroll);
    });
    onMount(() => {
        // Prevent scrolling glitches on touch devices!
        sections.addEventListener("touchstart", blockScroll);
        window.addEventListener("touchend", allowScroll);
        window.addEventListener("touchcancel", allowScroll);
        // Prevent scroll resize glitches
        let timeout = undefined,
            timeoutCall = function(section){
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if(sections.dataset.blockCodedScroll != "true"){
                        if(sections.interObs instanceof IntersectionObserver){
                            sections.interObs.disconnect();
                            sections.interObs = undefined;
                        }
                        // Start updating section height
                        allowResize = true;
                        watchSectionHeight(sections, section);
                    }else{
                        timeoutCall(section);
                    }
                }, 50);
            };
        // Navigate on scroll
        // Disable vert horizontal scrolling
        sections.onscroll = function(){
            if(allowScrollNav){
                let children = sections.children;
                for(let i = 0; i < children.length; i++){
                    let section = children[i];
                    if(isSectionVisable(sections, section)){
                        // Watch section intersections updates
                        if(sections.interObs instanceof IntersectionObserver){
                            sections.interObs.disconnect();
                            sections.interObs = undefined;
                        }
                        sections.interObs = new IntersectionObserver(function(payload){
                            if(payload[0].isIntersecting){
                                timeoutCall(section);
                            }
                        });
                        timeoutCall(section);
                        sections.interObs.observe(section);
                        // Navigate
                        allowResize = false;
                        if(location.pathname != section.dataset.path){
                            section.style.opacity = 1;
                            navigate(section.dataset.path);
                        }
                        break;
                    }
                }
            }
        };
    });
    return sections;
}

function watchSectionHeight(parent, section){
    // Remove all other resize observers
    for(let i = 0; i < parent.children.length; i++){
        parent.children[i].style.opacity = null;
        let obs = parent.children[i].children[0].resizeObs;
        if(obs instanceof ResizeObserver){
            obs.disconnect();
        }
    }
    section.style.opacity = 1;
    // Observe this element
    parent.style.height = section.children[0].clientHeight + "px";
    section.resizeObs = new ResizeObserver(function(entries) {
        parent.style.height = entries[0].contentRect.height + "px";
    });
    section.resizeObs.observe(section.children[0]);
}
function HomeSection(props){
    return (<div class={homeStyle.homeSection} {...props}>
        <div class={homeStyle.sectionContent}>
            {props.children}
        </div>
    </div>);
}

export default function Home(props){
    let location = useLocation(),
        loading,
        loadedCount = 0,
        firstLoad = true,
        loadedSection = function(){
            if(++loadedCount == links.length){
                props.pageLoaded(() => setTimeout(() => setAFS(true), 1200));
            }
        }, links = [
            ["Home", "/"],
            ["Personal info", "/home/personal"],
            ["Data and privacy", "/home/privacy"],
            ["Security", "/home/security"],
            ["People and sharing", "/home/sharing"],
            ["Payments and subscriptions", "/home/financial"]
        ], sectionsParent
        , showContent = function(section){
            loading.style.display = "none";
            sectionsParent.style.display = null;
            sectionsParent.style.height = section.children[0].clientHeight + "px";
            // Scroll section into view
            setTimeout(function(){
                sectionsParent.scrollTo(sectionsParent.clientWidth *
                                        Array.from(sectionsParent.children).indexOf(section), 0);
                watchSectionHeight(sectionsParent, section);
            }, 1);
        };
    const [allowFirstScroll, setAFS] = createSignal(false);
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        createEffect(() => {
            let loc = location.pathname.replace(/[#?].*$/g, "");
            let section = document.querySelector(`[data-path='${loc}']`);
            if(section instanceof HTMLElement && allowFirstScroll()){
                if(firstLoad){
                    firstLoad = false;
                    showContent(section);
                }else if(sectionsParent.dataset.blockCodedScroll != "true" && allowResize){
                    showContent(section);
                }
            }
        });
    });
    return <>
        <Title></Title>
        <h2 class={style.pageTitle}>Welcome, <Mark>{userData().displayUsername}</Mark>!</h2>
        <h4 class={style.pageDescription}>
            Manage your profile, privacy preferences, and security across all connected services
            and devices.
        </h4>
        <SearchBox/>
        <NavBar links={links} />
        <FlexContainer ref={loading}>
            <LoadingSpinner />
        </FlexContainer>
        <Sections ref={sectionsParent} style={{display: "none"}}>
            <For each={links}>{(link) => {
                return (<HomeSection data-path={link[1]}>
                    {sectionContent(link[1], loadedSection)}
                </HomeSection>);
            }}</For>
        </Sections>
    </>;
}