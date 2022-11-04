/**
 * 
 * Manage the content of the sign up page ('quick settings' section)
 * 
 **/

import style from './../../../assets/styles/pages/user.quick-settings.module.css';
 
import { Title } from './../../../assets/components/Title.jsx';
import { Button, Notice, Mark, FlexContainer, Radio, Divider, onRadioGroupChange, getRadioValueByNameGroup, showDialog } from './../../../assets/components/CustomElements.jsx';
import { InputFieldsContainer, nextCheck, redoRegister, ButtonsContainer } from './../register.jsx';
import { onCleanup, onMount } from 'solid-js';
import { updateColorScheme } from './../../../assets/scripts/colourScheme.jsx';
import { registerData, checkDataByOrder } from './../../../assets/scripts/pages/registerData.jsx';
import { useNavigate } from '@solidjs/router';

function QuickOption(props){
    return <Radio {...props}>{props.children}</Radio>
}

function QuickSetting(props){
    let desc;
    onMount(() => {
        desc.innerHTML = props.description;
    });
    return (<div class={style.quickSettingContainer}>
        <text class={style.title}>{props.title}</text>
        <text ref={desc} class={style.description}></text>
        <div class={style.contentContainer}>{props.children}</div>
    </div>);
}

function SectionTitle(props){
    return (<>
        <h4 class={style.sectionTitle}>{props.children}</h4>
        <Divider/>
    </>);
}

function SectionDivider(){
    return (<Divider style={{opacity: 0.1, margin: "28px 8px"}}/>);
}

function recordOption(){
    return "&nbsp;&nbsp;&#x2022;&nbsp;&nbsp;";
}

export default function RegisterQuickSettings(props){
    let nextButton,
        navigate = useNavigate();
    onMount(() => {
        if(registerData.quickSettings.profile != undefined){
            document.getElementById("profile-" + registerData.quickSettings.profile).checked = true;
        }
        if(registerData.quickSettings.activity != undefined){
            document.getElementById("activity-" + registerData.quickSettings.activity).checked = true;
        }
        if(registerData.quickSettings.location != undefined){
            document.getElementById("location-" + registerData.quickSettings.location).checked = true;
        }
        if(registerData.quickSettings.colorScheme != undefined){
            document.getElementById("color-scheme-" + registerData.quickSettings.colorScheme).checked = true;
        }
        onRadioGroupChange("color-scheme", function(){
            updateColorScheme(Number(getRadioValueByNameGroup("color-scheme")));
        });
        updateColorScheme(Number(getRadioValueByNameGroup("color-scheme")));
        checkDataByOrder(5, function(error){
            if(error){
                redoRegister(navigate);
            }else{
                props.pageLoaded();
            }
        });
    });
    onCleanup(() => {
        props.pageUnloading();
    });
    return <>
        <Title>Sign Up</Title>
        <h1>Quick Settings</h1>
        <br/>
        <h3>Choose the settings that suit your <Mark>personal preferences</Mark>!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <InputFieldsContainer>
                <SectionTitle>Privacy</SectionTitle>
                <QuickSetting title={"Public profile"} description={"All Ciel users have a public Ciel profile. Ciel profiles include basic public information like the user's profile picture, username, and registration date. Rich profiles can include more data!<br><br>(Note that some of your information might be public on third-party services, no matter the status of your public profile)"}>
                    <QuickOption id={"profile-1"} name={"profile"} value={1} checked>Show profile with rich data</QuickOption>
                    <QuickOption id={"profile-2"} name={"profile"} value={2}>Show profile with limited data</QuickOption>
                    <QuickOption id={"profile-3"} name={"profile"} value={3}>Hide profile</QuickOption>
                </QuickSetting>
                <SectionDivider/>
                <QuickSetting title={"Activity history"} description={
                    `The activity history can only be accessed by the owner of this account. It cannot be shared with any of your connected third-party services or any external servers.<br/><br/>
                    There are three types of activity records:<br/>
                    ${recordOption()} Ciel records: your login activity, settings modifications, new connections, and other similar information.<br/>
                    ${recordOption()} Ciel-affiliated services records: data from Ciel-affiliated official services. (e.g. 0x0C services)<br/>
                    ${recordOption()} Third-party records: data from your connected third-party services. (You can review and modify the reported data on your first connection to each third-party service)`}>
                    <QuickOption id={"activity-1"} name={"activity"} value={1} checked>Collect data from Ciel, its official affiliated services, and connected third-party services</QuickOption>
                    <QuickOption id={"activity-2"} name={"activity"} value={2}>Collect data from Ciel and its official affiliated services</QuickOption>
                    <QuickOption id={"activity-3"} name={"activity"} value={3}>Collect data only from the Ciel service</QuickOption>
                </QuickSetting>
                <SectionDivider/>
                <QuickSetting title={"Location data"} description={"Your location data can help us keep your Ciel account secure. Location data can help us keep track of your login activity better and make it hard for people to impersonate you."}>
                    <QuickOption id={"location-1"} name={"location"} value={1} checked>Collect approximate location data</QuickOption>
                    <QuickOption id={"location-2"} name={"location"} value={2}>Do not collect location data</QuickOption>
                </QuickSetting>

                <SectionTitle>Extra</SectionTitle>
                <QuickSetting title={"Colour Scheme"} description={"Select your prefered colour scheme. (Synced across devices)"}>
                    <QuickOption id={"color-scheme-0"} name={"color-scheme"} value={0} checked>Auto (System preference)</QuickOption>
                    <QuickOption id={"color-scheme-1"} name={"color-scheme"} value={1}>Light</QuickOption>
                    <QuickOption id={"color-scheme-2"} name={"color-scheme"} value={2}>Dark</QuickOption>
                </QuickSetting>
            </InputFieldsContainer>
            <Notice>You can always change your account's settings and privacy preferences using your account's control panel!</Notice>
            <ButtonsContainer>
                <Button type={"action"} function={function(){ if(registerData.quickSettings.colorScheme == undefined) updateColorScheme(0); history.back()}}>Go back</Button>
                <Button ref={nextButton} type={"action"} function={function(){
                    nextCheck(nextButton, function(setError, isDone){
                        if(getRadioValueByNameGroup("profile") == undefined ||
                            getRadioValueByNameGroup("activity") == undefined ||
                            getRadioValueByNameGroup("location") == undefined ||
                            getRadioValueByNameGroup("color-scheme") == undefined){
                                showDialog("Unexpected error!",
                                            "The required data is incomplete.",[
                                                ["Ok", function(dialog, remove){
                                                    remove();
                                                }]
                                            ]
                                );
                                setError();
                            }
                        isDone();
                    }, function(){
                        registerData.quickSettings.profile = Number(getRadioValueByNameGroup("profile"));
                        registerData.quickSettings.activity = Number(getRadioValueByNameGroup("activity"));
                        registerData.quickSettings.location = Number(getRadioValueByNameGroup("location"));
                        registerData.quickSettings.colorScheme = Number(getRadioValueByNameGroup("color-scheme"));
                        checkDataByOrder(6, function(error){
                            if(error){
                                redoRegister(navigate, true);
                            }else{
                                navigate("/user/register/agreement");
                            }
                        });
                    });
                }} primary>Next</Button>
            </ButtonsContainer>
        </FlexContainer>
    </>;
}