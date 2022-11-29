/**
 * 
 * The custom <NavBar> element (only used when signed in)
 * 
 **/

import { For, onCleanup, onMount } from 'solid-js';
import { afterURLChange } from './../scripts/traffic.jsx';
import generalStyles from './../styles/general.module.css';

import Link from './Link.jsx';
import { processProps } from './_custom.jsx';

function updateShadows(content, start, end){
    if(content.scrollLeft + content.clientWidth >= content.scrollWidth){
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
        scrollToOption = function(link){
            content.scrollTo({
                top: 0,
                left: (function(){
                    let s = 0,
                        lastW = 0,
                        stop = false;
                    linksElms.forEach(l => {
                        if(!stop){
                            if(l[1] == link[1]){
                                stop = true;
                                s -= (link[1] == linksElms[linksElms.length - 1][1]) ? 0 : lastW;
                            }else{
                                s += l[2].clientWidth;
                                lastW = l[2].clientWidth;
                            }
                        }
                    });
                    return s;
                })(),
                behavior: (firstScroll) ? (firstScroll = false, "auto") : "smooth"
            });
        },
        callback = function(){
            isHome = location.pathname.replace(/[#?].*$/g, "") == "/";
            linksElms.forEach(link => {
                if((!selected && isHome) ||
                    (!selected && location.pathname.indexOf(link[1]) == 0 && link[1] != props.links[0][1])){
                    link[2].setAttribute("selected", "");
                    scrollToOption(link);
                    selected = true;
                }
            });
        },
        content,
        startShadow, endShadow,
        resizeUpdate = function(){
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
    });
    onCleanup(() => {
        updateShadows(content, startShadow, endShadow);
        window.removeEventListener("resize", resizeUpdate);
    });
    return (<div class={basicProps.class} style={basicProps.style} unselectable>
        <div ref={startShadow} class={generalStyles.startShadow} style={{display: "none"}}></div>
        <div ref={content} class={generalStyles.navLinks} onScroll={function(){
                    updateShadows(content, startShadow, endShadow);
                }}>
            <For each={props.links}>
                {(link) => {
                    let l = linksElms.length;
                    link.push(<Link class={generalStyles.navOption} href={link[1]}>{link[0]}</Link>);
                    linksElms[l] = link;
                    return linksElms[l][2];
                }}
            </For>
        </div>
        <div ref={endShadow} class={generalStyles.endShadow}  style={{display: "none"}}></div>
    </div>);
}
  
export default NavBar;