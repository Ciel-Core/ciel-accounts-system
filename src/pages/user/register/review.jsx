/**
 * 
 * Manage the content of the sign up page (review section)
 * 
 **/

import style from './../../../assets/styles/pages/user.review.module.css';

import { Title } from './../../../assets/components/Title.jsx';
import { Button, Notice, Mark, FlexContainer, showDialog } from './../../../assets/components/CustomElements.jsx';
import { createSignal, onMount, onCleanup } from "solid-js";
import { useNavigate } from '@solidjs/router';
import { registerData, checkDataByOrder } from './../../../assets/scripts/pages/registerData.jsx';
import { ButtonsContainer, nextCheck, redoRegister } from './../register.jsx';
import { getSecurityQuestions } from './../../../assets/scripts/securityQuestions.jsx';
import { signUpPOST } from './../../../assets/scripts/communication/accounts.jsx';

function ReviewTable(props){
    return (<table class={style.table} {...props}></table>);
}

function ReviewItem(props){
    return (<tr class={style.item}>
        <td class={style.title} unselectable><text>{props.title}</text></td>
        <td class={style.content}><text class={style.contentTextWrapper}>{props.children}</text></td>
    </tr>);
}

function SecurityQuestionItem(props){
    return (<div class={style.securityQuestionItem}>
        <text class={style.securityQuestion}>{props.question}</text>
        <text class={style.securityQuestionAnswer}>{props.answer}</text>
    </div>);
}

function securityQuesiton(securityQuestions, section, number){
    if(securityQuestions != undefined){
        return securityQuestions[section][number - 1]
    }
    return undefined;
}

export default function RegisterReview(props){
    let navigate = useNavigate(),
        nextButton;
    const [securityQuestions, setSecurityQuestions] = createSignal(undefined);
    onMount(() => {
        checkDataByOrder(7, function(error){
            if(error){
                redoRegister(navigate);
            }else{
                getSecurityQuestions().then(function(data){
                    setSecurityQuestions(data);
                    props.pageLoaded();
                });
            }
        });
    });
    onCleanup(() => {
        props.pageUnloading();
    });
    return <>
        <Title>Sign Up</Title>
        <h1>Let's Review</h1>
        <br/>
        <h3>Make sure these are the <Mark>configurations</Mark> you want!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <ReviewTable>
                <ReviewItem title={"Owner"}>{registerData.name.first} {registerData.name.last}</ReviewItem>
                <ReviewItem title={"Username"}>{registerData.username}</ReviewItem>
                <ReviewItem title={"Birthday"}>{(new Date(`${registerData.birthdate.month}/${registerData.birthdate.day}/${registerData.birthdate.year}`)).toLocaleDateString('en-UK')}</ReviewItem>
                <ReviewItem title={"Gender"}>{registerData.gender} ({(function(){
                    if(registerData.pronounce == 1){
                        return "he/him";
                    }else if(registerData.pronounce == 2){
                        return "she/her";
                    }else{
                        return "they/them";
                    }
                })()})</ReviewItem>
                <ReviewItem title={"Security Question #1"}>
                    <SecurityQuestionItem question={securityQuesiton(securityQuestions(), 1, registerData.securityQuestions.q1)}
                                            answer={registerData.securityQuestions.a1}/>
                </ReviewItem>
                <ReviewItem title={"Security Question #2"}>
                    <SecurityQuestionItem question={securityQuesiton(securityQuestions(), 2, registerData.securityQuestions.q2)}
                                            answer={registerData.securityQuestions.a2}/>
                </ReviewItem>
                <ReviewItem title={"Security Question #3"}>
                    <SecurityQuestionItem question={securityQuesiton(securityQuestions(), 3, registerData.securityQuestions.q3)}
                                            answer={registerData.securityQuestions.a3}/>
                </ReviewItem>
                <ReviewItem title={"Public Profile"}>{(function(){
                    if(registerData.quickSettings.profile == 1){
                        return "Rich";
                    }else if(registerData.quickSettings.profile == 2){
                        return "Limited";
                    }else if(registerData.quickSettings.profile == 3){
                        return "Hidden";
                    }
                })()}</ReviewItem>
                <ReviewItem title={"Activity History"}>{(function(){
                    if(registerData.quickSettings.activity == 1){
                        return "Ciel, Affiliated, and third-party";
                    }else if(registerData.quickSettings.activity == 2){
                        return "Ciel & Affiliated";
                    }else if(registerData.quickSettings.activity == 3){
                        return "Only Ciel";
                    }
                    // 1 - Ciel.affiliated.third-party, 2 - Ciel.affiliated, 3 - Ciel
                    return null;
                })()}</ReviewItem>
                <ReviewItem title={"Location"}>{(registerData.quickSettings.location == 1) ? "Approximate" : "Precise"}</ReviewItem>
                <ReviewItem title={"Colour Scheme"}>{(function(){
                    //
                    if(registerData.quickSettings.colorScheme == 1){
                        return "Light";
                    }else if(registerData.quickSettings.colorScheme == 2){
                        return "Dark";
                    }else{
                        return "Auto";
                    }
                })()}</ReviewItem>
            </ReviewTable>
            <Notice>You can always change your account configurations from your account console!</Notice>
            <ButtonsContainer>
                <Button type={"action"} function={function(){history.back()}}>Go back</Button>
                <Button ref={nextButton} type={"action"} function={function(){
                        nextCheck(nextButton, function(setError, isDone){
                            registerData.extraData.registrationDisplayLanguage = "en-GB";
                            checkDataByOrder(8, function(error){
                                if(error){
                                    isDone();
                                    redoRegister(navigate);
                                }else{
                                    signUpPOST(registerData, function(isSuccessful, response){
                                        isDone();
                                        if(isSuccessful){
                                            alert(":)");
                                        }else{
                                            showDialog("Error!", "We couldn't create your Ciel account! Please try again at a later time.");
                                        }
                                    });
                                    //showDialog("Unavailable!", "The accounts system infrastructure is not ready yet!");
                                }
                            });
                        }, function(){});
                    }} primary>Create account</Button>
            </ButtonsContainer>
        </FlexContainer>
    </>;
}