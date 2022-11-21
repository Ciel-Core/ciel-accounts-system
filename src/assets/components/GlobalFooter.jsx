/**
 * 
 * The global bar, and its relative elements
 * 
 **/

import styles from './../styles/globalFooter.module.css';

import InfoIcon from './../icons/info.svg';
import { useNavigate } from '@solidjs/router';
import { showDialog } from './Dialog.jsx';
import { FlexContainer } from './CustomElements.jsx';

function FooterLink(props){
    return (<a href={props.href} target={"_blank"} class={styles.link}>{props.children}</a>);
}

function GlobalFooter(props){
    let navigate = useNavigate();
    return (
        <div id="global-footer" class={styles.globalfooter} data-show-content={props.showContent}
                unselectable>
            <FooterLink href={"/about/legal"}>Legal</FooterLink>
            <FooterLink href={"/about/services"}>Services</FooterLink>
            <InfoIcon class={styles.icon} onClick={() => showDialog("About Ciel", (<FlexContainer horizontal>
                <h4>Version 0.00.00 (beta)</h4>
                <a>LICENSES</a>
            </FlexContainer>))}/>
        </div>
    );
}

export default GlobalFooter;
