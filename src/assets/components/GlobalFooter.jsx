/**
 * 
 * The global bar, and its relative elements
 * 
 **/

import styles from './../styles/globalFooter.module.css';
import generalStyles from './../styles/general.module.css';

import InfoIcon from './../icons/info.svg';
import { useNavigate } from '@solidjs/router';
import { showDialog } from './Dialog.jsx';
import { FlexContainer } from './CustomElements.jsx';
import { isOnline } from './../scripts/internetConnection.jsx';

function FooterLink(props){
    return (<a href={props.href} target={"_blank"} class={styles.link} disable={props.disable}>{props.children}</a>);
}

function GlobalFooter(props){
    let navigate = useNavigate();
    return (
        <div id="global-footer" class={styles.globalfooter} data-show-content={props.showContent}
                unselectable>
            <FooterLink href={"/about/legal"} disable={!isOnline()}>Legal</FooterLink>
            <FooterLink href={"/about/services"} disable={!isOnline()}>Services</FooterLink>
            <InfoIcon class={styles.icon} onClick={() => showDialog(`About ${import.meta.env.VITE_NAME}`, (<FlexContainer class={styles.aboutContainer} horizontal>
                <h4>
                    Version {
                        import.meta.env.VITE_V_FRONT_MAJOR}.
                        {import.meta.env.VITE_V_FRONT_MINOR}.
                        {import.meta.env.VITE_V_FRONT_FIX
                    } ({import.meta.env.VITE_V_TYPE})
                </h4>
                <h5>
                    Server version {
                        import.meta.env.VITE_V_BACK_MAJOR}.
                        {import.meta.env.VITE_V_BACK_FIX
                    }_PHP_MYSQL
                </h5>
                <h5>
                    No copyright applys.
                    No trademarks.
                    Owned by <a
                        href={import.meta.env.VITE_OWNER_LINK} target={"_blank"}
                        class={generalStyles.link}>
                            {import.meta.env.VITE_OWNER_NAME}
                        </a>
                </h5>
                <h5>
                    Source code available on <a
                        href={import.meta.env.VITE_GITHUB_REPOSITORY_LINK} target={"_blank"}
                        class={generalStyles.link}>
                            GitHub
                        </a>
                </h5>
            </FlexContainer>))}/>
        </div>
    );
}

export default GlobalFooter;
