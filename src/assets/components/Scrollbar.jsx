/**
 * 
 * The custom <Scrollbar> element
 * 
 **/

import { onMount } from 'solid-js';
import style from './../styles/scrollbar.module.css';

let handle, handleHeight;

function showScrollbar(){
    handle.focus();
}
function hideScrollbar(){
    handle.blur();
}
function observeBody(callback){
    // create an Observer instance
    const resizeObserver = new ResizeObserver(entries => {
        callback();
    });
    resizeObserver.observe(document.body)
}
function setUpScroll(){
    window.onscroll = function(){
        handle.style.marginTop = `${(window.scrollY + window.innerHeight)/(document.body.scrollHeight)*(window.innerHeight - 16) - handleHeight}px`;
        showScrollbar();
        hideScrollbar();
    };
}

let mouseDown = false, lastPosition;
function setupScrollStart(){
    handle.onmousedown = function(e){
        if(!mouseDown){
            mouseDown = true;
            lastPosition = e.clientY;
            document.documentElement.setAttribute("unselectable", "");
        }
    };
}
function onScrollMove(callback){
    window.addEventListener("mousemove", function(e){
        if(mouseDown){
            callback(e.clientY - lastPosition);
            lastPosition = e.clientY;
        }
    });
}
function setupScrollEnd(){
    let f = function(){
        if(mouseDown){
            mouseDown = false;
            document.documentElement.removeAttribute("unselectable");
        }
    };
    document.onmouseup = f;
}

export default function Scrollbar(){
    // Scrollbar height: calc(100VH - 12px)
    let scrollbarContainer;

    onMount(() => {
        observeBody(function(){
            if(document.body.scrollHeight <= window.innerHeight){
                scrollbarContainer.style.display = "none";
            }else{
                handleHeight = (window.innerHeight/document.body.scrollHeight)
                                *(window.innerHeight - 16); // WATCH OUT, REMEMBER TO UPDATE THIS WHEN YOU CHANGE THE STYLE OF THE SCROLLBAR
                handle.style.height = `${handleHeight}px`;
                scrollbarContainer.style.display = null;
            }
        });
        setUpScroll();
        setupScrollStart();
        setupScrollEnd();
        onScrollMove(function(diff){
            window.scrollTo(0, window.scrollY +
                                diff*(document.body.scrollHeight/(window.innerHeight - 16)));
        });
    });

    return (<div ref={scrollbarContainer} class={style.scrollbarContainer}>
        <div class={style.scrollbar}>
            <div ref={handle} class={style.handle} tabindex={0}></div>
        </div>
    </div>);
}