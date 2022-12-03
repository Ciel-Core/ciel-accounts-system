/**
 * 
 * The custom <NavBar> element (only used when signed in)
 * 
 **/

import generalStyles from './../styles/general.module.css';
 
import { For, onCleanup, onMount } from 'solid-js';
import { afterURLChange } from './../scripts/traffic.jsx';
import Link from './Link.jsx';
import { processProps, watchStickyContent, watchStickyContentRemove } from './_custom.jsx';

import BackArrowIcon from './../icons/arrow_back.svg';
import ForwardArrowIcon from './../icons/arrow_forward.svg';

function updateShadows(content, start, end){
    if(content.clientWidth >= content.scrollWidth - 10){
        end.style.display = "none";
        start.style.display = "none"
    }else if(content.scrollLeft + content.clientWidth >= content.scrollWidth - 10){
        end.style.display = "none";
        start.style.display = null;
    }else if(content.scrollLeft == 0){
        start.style.display = "none";
        end.style.display = null;
    }else{
        end.style.display = null;
        start.style.display = null;
    }
}

let firstScroll = true;

export function NavBar(props){
    let basicProps = processProps(props, generalStyles.navBar),
        linksElms = [],
        isHome = false,
        selected = false,
        scrollToOption = function(link, left = undefined){
            content.scrollTo({
                left: (left == undefined) ? (function(){
                    let s = 0,
                        lastW = 0,
                        stop = false;
                    linksElms.forEach(l => {
                        if(!stop){
                            if(l[1] == link[1]){
                                stop = true;
                                s -= (link[1] == linksElms[linksElms.length - 1][1]) ?
                                        0 : lastW / 2;
                            }else{
                                s += l[2].clientWidth;
                                lastW = l[2].clientWidth;
                            }
                        }
                    });
                    return s;
                })() : left,
                behavior: (firstScroll) ? (firstScroll = false, "auto") : "smooth"
            });
        },
        callback = function(){
            isHome = location.pathname.replace(/[#?].*$/g, "") == "/";
            linksElms.forEach(link => {
                if((!selected && isHome) ||
                    (!selected && location.pathname.indexOf(link[1]) == 0
                        && link[1] != props.links[0][1])){
                    link[2].setAttribute("selected", "");
                    scrollToOption(link);
                    selected = true;
                }
            });
        },
        container, content,
        startShadow, endShadow,
        resizeUpdate = function(){
            updateShadows(content, startShadow, endShadow);
            linksElms.forEach(link => {
                if(link[2].hasAttribute("selected")){
                    scrollToOption(link);
                }
            });
        };
    onMount(() => {
        afterURLChange(function(){
            selected = false;
            linksElms.forEach(l => l[2].removeAttribute("selected"));
            callback();
        });
        setTimeout(() => {
            callback();
            updateShadows(content, startShadow, endShadow);
        }, 1);
        window.addEventListener("resize", resizeUpdate);
        content.onscroll = function(){
            updateShadows(content, startShadow, endShadow);
        };
        watchStickyContent(container, 99);
    });
    onCleanup(() => {
        updateShadows(content, startShadow, endShadow);
        window.removeEventListener("resize", resizeUpdate);
        watchStickyContentRemove(container, 99);
    });
    return (<div ref={container} class={basicProps.class} style={basicProps.style} unselectable>
        <div ref={startShadow} class={generalStyles.startShadow} style={{display: "none"}}>
            <BackArrowIcon class={generalStyles.icon}
                            onClick={() => scrollToOption(undefined, content.scrollLeft - 100)} />
        </div>
        <div ref={content} class={generalStyles.navLinks} onScroll={function(){
                    updateShadows(content, startShadow, endShadow);
                }}>
            <For each={props.links}>
                {(link) => {
                    let l = linksElms.length;
                    link.push(
                        <Link class={generalStyles.navOption} href={link[1]}>
                            {link[0]}
                        </Link>
                    );
                    linksElms[l] = link;
                    return linksElms[l][2];
                }}
            </For>
        </div>
        <div ref={endShadow} class={generalStyles.endShadow}  style={{display: "none"}}>
            <ForwardArrowIcon class={generalStyles.icon}
                            onClick={() => scrollToOption(undefined, content.scrollLeft + 100)} />
        </div>
    </div>);
}
  
export default NavBar;