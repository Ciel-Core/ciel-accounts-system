/**
 * 
 * The global bar, and its relative elements
 * 
 **/

import styles from './../styles/globalFooter.module.css';

import InfoIcon from './../icons/info.svg';
import { useNavigate } from '@solidjs/router';

function FooterLink(props){
    return (<a href={props.href} target={"_blank"} class={styles.link}>{props.children}</a>);
}

function GlobalFooter(props){
    let navigate = useNavigate();
    return (
        <div id="global-footer" class={styles.globalfooter} data-show-content={props.showContent}>
            <FooterLink href={"/about/legal"}>Legal</FooterLink>
            <FooterLink href={"/about/services"}>Services</FooterLink>
            <InfoIcon class={styles.icon} onClick={() => navigate("/about")}/>
        </div>
    );
}

export default GlobalFooter;
