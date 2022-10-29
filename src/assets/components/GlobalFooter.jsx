/**
 * 
 * The global bar, and its relative elements
 * 
 **/

import styles from './../styles/globalFooter.module.css';

function FooterLink(props){
    return (<a href={props.href} target={"_blank"} class={styles.link}>{props.children}</a>);
}

function GlobalFooter(props){
    return (
        <div id="global-footer" class={styles.globalfooter} data-show-content={props.showContent}>
            {/* Note to myself: You could use https://www.privacypolicies.com/ as a starting point */}
            <FooterLink href={"/about/legal/"}>Legal documents</FooterLink> | 
            <FooterLink href={"/about/services/"}>Affiliated services</FooterLink> | 
            <FooterLink href={"/about/"}>About Ciel</FooterLink>
        </div>
    );
}

export default GlobalFooter;
