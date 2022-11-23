/**
 * 
 * Manage the content of the 2 factor auth options page
 * 
 **/

import style from './../../assets/styles/pages/user.challenge.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { Mark, Button, FlexContainer, Link, Divider, showDialog } from './../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { factorStatePOST } from './../../assets/scripts/communication/accounts.jsx';

// Import SVG icons
import SecurityKeyIcon from './../../assets/icons/security_key.svg';
import MobileDeviceIcon from './../../assets/icons/mobile_device.svg';
import SettingsAltIcon from './../../assets/icons/settings_alt.svg';
import LockIcon from './../../assets/icons/lock.svg';
import WidgetIcon from './../../assets/icons/widget.svg';

function ChallengeOption(props){
    return (
        <Button light class={style.challengeOptionButton} type={"link"}
                icon={props.icon} function={props.action} {...props}>
            {props.children}
        </Button>
    );
}

function SecurityKey(props){
    return (<ChallengeOption icon={<SecurityKeyIcon/>} {...props}>
            Use your security key
        </ChallengeOption>);
}
function AppPrompt(props){
    return (<ChallengeOption icon={<MobileDeviceIcon/>} {...props}>
            Tap <strong>Yes</strong> on your mobile device
        </ChallengeOption>);
}
function OfflineAppCode(props){
    return (<ChallengeOption icon={<SettingsAltIcon/>} {...props}>
            Use a security code from your mobile device
        </ChallengeOption>);
}
function BackupCodes(props){
    return (<ChallengeOption icon={<LockIcon/>} {...props}>
            Enter one of your <strong>emergency</strong> backup codes
        </ChallengeOption>);
}
function AuthApp(props){
    return (<ChallengeOption icon={<WidgetIcon/>} {...props}>
            Get a verification code from <strong>{props.name}</strong>
        </ChallengeOption>);
}

export function checkFactorState(onSuccess, nav){
    factorStatePOST(function(success, data){
        if(!success || !data.awaitingAuth){
            showDialog("Something went wrong!",
                        "It seems there is no account awaiting authentication on this device!",
                        [["Ok", function(dialog, remove){
                            nav("/");
                            remove();
                        }]]);
        }else{
            onSuccess();
        }
    });
}

export default function Challenge(props){
    let navigate = useNavigate();
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        checkFactorState(props.pageLoaded, navigate);
    });
    return <>
        <Title>Sign In</Title>
        <h1>2-Step Verification</h1>
        <br/>
        <h3>For your safety please <Mark>verify your identity</Mark> further using one of the following methods:</h3>
        <FlexContainer style={{width: "400px"}}>
            <SecurityKey href={"/user/challenge/key"} disabled />
            <AppPrompt  href={"/user/challenge/app-prompt"} disabled />
            <OfflineAppCode href={"/user/challenge/app-code"} disabled />
            <AuthApp name={"[App_Name]"} href={"/user/challenge/auth-app/#id"} />
            <BackupCodes href={"/user/challenge/backup"} />
            {/*<AuthApp name={"[App_Name_2]"}/>
            <AuthApp name={"[App_Name_3]"}/>
            <AuthApp name={"[App_Name_4]"}/>
            <AuthApp name={"[App_Name_5]"}/>
            <AuthApp name={"[App_Name_6]"}/>
            <AuthApp name={"[App_Name_7]"}/>
            <AuthApp name={"[App_Name_8]"}/>
            <AuthApp name={"[App_Name_9]"}/>
            <AuthApp name={"[App_Name_10]"}/>*/}
        </FlexContainer>
        <div class={style.suggestion}>
            <Divider/>
            <text>Can't do any of these? Try to <Link href={"/user/recovery/two-factor"}>recover your account</Link>!</text>
        </div>
    </>;
}