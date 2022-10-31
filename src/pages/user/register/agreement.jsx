/**
 * 
 * Manage the content of the sign up page (agreement section)
 * 
 **/

import style from './../../../assets/styles/pages/user.agreement.module.css';

import { Title } from './../../../assets/components/Title.jsx';
import { Button, Notice, Mark, FlexContainer, showDialog } from './../../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { registerData, checkDataByOrder } from './../../../assets/scripts/pages/registerData.jsx';
import { ButtonsContainer, InputFieldsContainer, nextCheck, redoRegister } from './../register.jsx';

import PaperIcon from './../../../assets/icons/paper.svg';
import InfoIcon from './../../../assets/icons/info.svg';

function AgreementItem(props){
    let desc;
    onMount(() => {
        if(props.description == undefined){
            desc.remove();
        }
    });
    return (<div class={style.agreementItem}>
        <div class={style.titleContainer}>
            {props.icon}
            <text class={style.title}>{props.title}</text>
        </div>
        <text ref={desc} class={style.description}>{props.description}</text>
        {(function(){
            if(props.link != undefined){
                return (<Button class={style.button} type={"action"} function={function(){}}
                                light small disabled>Read more</Button>);
            }
        })()}
    </div>);
}

export default function RegisterAgreement(props){
    let navigate = useNavigate(),
        nextButton;
    onMount(() => {
        checkDataByOrder(6, function(error){
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
        <h1>User agreement</h1>
        <br/>
        <h3>To create a <Mark>Ciel account</Mark> and use all related services you must <Mark>agree</Mark> to the following:</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <InputFieldsContainer>
                {/* https://www.freeprivacypolicy.com/free-privacy-policy-generator/ */}
                <AgreementItem link={0} title={"Terms and Conditions"} icon={<PaperIcon/>}/>
                <AgreementItem link={0} title={"Privacy Policy"} icon={<PaperIcon/>}/>
                <AgreementItem link={0} title={"Disclaimer"} icon={<PaperIcon/>}/>
                <AgreementItem link={0} title={"Cookies Policy"} icon={<PaperIcon/>} description={"Applies to the Ciel website and all login/permission prompts."}/>
                <AgreementItem link={0} title={"End-user license agreement (EULA)"} icon={<PaperIcon/>} description={"Applies when using software created by, or officially affiliated with, Ciel."}/>
                <AgreementItem title={"Cookie Consent"} icon={<InfoIcon/>} description={"Ciel requires the use of cookies in order to function as intended. We use cookies to keep track of your ongoing sessions, analyse our website's traffic, and understand where our visitors are coming from. By using any of our services, you consent to us using cookies."}/>
                <AgreementItem title={"Notice"} icon={<InfoIcon/>} description={"Ciel and all of its officially affiliated services are a part of an open beta. Once this beta ends, all the collected data across the aforementioned services will be deleted permanently. This means you will lose access to all of your data and third-party services connected to your Ciel account once the open beta ends. (You will be notified of the end of the open beta 14 days in advance)"}/>
                <AgreementItem title={"Notice"} icon={<InfoIcon/>} description={"This is an experimental project. We do NOT hold responsibility for any data loss, data leaks, or any misuse of this service at the hand of third-party developers."}/>
            </InputFieldsContainer>
            <Notice>Note that all of the provided legal content above could change at any time. You will be notified one month prior to any change.</Notice>
            <ButtonsContainer>
                <Button type={"action"} function={function(){history.back()}}>Go back</Button>
                <Button ref={nextButton} type={"action"} function={function(){
                        nextCheck(nextButton, function(setError, isDone){
                            isDone();
                        }, function(){
                            registerData.agreement = true;
                            checkDataByOrder(7, function(error){
                                if(error){
                                    redoRegister(navigate, true);
                                }else{
                                    showDialog("Notice", "If you agree to create an account, you are effectively agreeing to the yet-to-be-written legal documents that are missing from this page!",
                                                [
                                                    ["Ok", function(dialog, remove){
                                                        navigate("/user/register/review");
                                                        remove();
                                                    }], ["Cancel", function(dialog, remove){
                                                        registerData.agreement = false;
                                                        remove();
                                                    }]
                                                ]);
                                }
                            });
                        });
                    }} primary>I agree</Button>
            </ButtonsContainer>
        </FlexContainer>
    </>;
}