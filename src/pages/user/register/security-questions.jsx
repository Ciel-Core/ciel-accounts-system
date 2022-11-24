/**
 * 
 * Manage the content of the sign up page (security questions section)
 * 
 **/

import { Title } from './../../../assets/components/Title.jsx';
import { Help } from './../../../assets/components/Help.jsx';
import { Input, Select, Button, Notice, Mark, FlexContainer, setInputState } from './../../../assets/components/CustomElements.jsx';
import { InputFieldsContainer, clientDataCheck, nextCheck, redoRegister, ButtonsContainer } from './../register.jsx';
import { createSignal, onMount, onCleanup } from "solid-js";
import { useNavigate } from '@solidjs/router';
import { registerData, checkDataByOrder } from './../../../assets/scripts/pages/registerData.jsx';
import { getSecurityQuestions } from './../../../assets/scripts/securityQuestions.jsx';

function checkQuestionStatus(number, answerElm){
    let question = document.getElementById("security-q" + number),
        answer = document.getElementById("security-a" + number);
    if(question.selectedIndex > 0){
        answer.value = "";
        if(answerElm.style.display == "none"){
            answerElm.style.display = null;
            answerElm.children[0].children[0].focus();
            answerElm.children[0].children[0].onclick();
        }
    }else{
        answerElm.style.display = "none";
    }
}

export default function RegisterSecurityQuestions(props){
    let navigate = useNavigate(),
        nextButton, qusElm1, qusElm2, qusElm3, ansElm1, ansElm2, ansElm3;
    const [securityQuestions, setSecurityQuestions] = createSignal({
        1: [undefined, undefined, undefined, undefined, undefined, undefined],
        2: [undefined, undefined, undefined, undefined, undefined, undefined],
        3: [undefined, undefined, undefined, undefined, undefined, undefined]
    });
    onMount(() => {
        if(registerData.securityQuestions.q1 != undefined){
            qusElm1.children[0].children[0].value = registerData.securityQuestions.q1;
        }
        if(registerData.securityQuestions.q2 != undefined){
            qusElm2.children[0].children[0].value = registerData.securityQuestions.q2;
        }
        if(registerData.securityQuestions.q3 != undefined){
            qusElm3.children[0].children[0].value = registerData.securityQuestions.q3;
        }
        checkQuestionStatus(1, ansElm1);
        checkQuestionStatus(2, ansElm2);
        checkQuestionStatus(3, ansElm3);
        ansElm1.children[0].children[0].blur();
        ansElm2.children[0].children[0].blur();
        ansElm3.children[0].children[0].blur();
        if(registerData.securityQuestions.a1 != undefined){
            ansElm1.children[0].children[0].value = registerData.securityQuestions.a1;
        }
        if(registerData.securityQuestions.a2 != undefined){
            ansElm2.children[0].children[0].value = registerData.securityQuestions.a2;
        }
        if(registerData.securityQuestions.a3 != undefined){
            ansElm3.children[0].children[0].value = registerData.securityQuestions.a3;
        }
        clientDataCheck(nextButton, "security-q1", "security-q2", "security-q3",
                            "security-a1", "security-a2", "security-a3");
        checkDataByOrder(4, function(error){
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
        <Help feed={"register"}/>
        <h1>Security is key!</h1>
        <br/>
        <h3>Choose your <Mark>security questions</Mark> and answer them!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <InputFieldsContainer>
                <Select ref={qusElm1} id={"security-q1"} label={"Question 1"} style={{width: "calc(100% - 8px)"}}
                        onChange={function(){
                            checkQuestionStatus(1, ansElm1);
                        }}>
                    <option value={1}>{securityQuestions()[1][0]}</option>
                    <option value={2}>{securityQuestions()[1][1]}</option>
                    <option value={3}>{securityQuestions()[1][2]}</option>
                    <option value={4}>{securityQuestions()[1][3]}</option>
                    <option value={5}>{securityQuestions()[1][4]}</option>
                    <option value={6}>{securityQuestions()[1][5]}</option>
                </Select>
                <Input ref={ansElm1} id={"security-a1"} type={"text"} label={"Answer 1"}
                        style={{width: "calc(100% - 8px)"}} maxlength={255} onSumbit={() => nextButton}/>
                </InputFieldsContainer>
                <InputFieldsContainer>
                <Select ref={qusElm2} id={"security-q2"} label={"Question 2"} style={{width: "calc(100% - 8px)"}}
                        onChange={function(){
                            checkQuestionStatus(2, ansElm2);
                        }}>
                    <option value={1}>{securityQuestions()[2][0]}</option>
                    <option value={2}>{securityQuestions()[2][1]}</option>
                    <option value={3}>{securityQuestions()[2][2]}</option>
                    <option value={4}>{securityQuestions()[2][3]}</option>
                    <option value={5}>{securityQuestions()[2][4]}</option>
                    <option value={6}>{securityQuestions()[2][5]}</option>
                </Select>
                <Input ref={ansElm2} id={"security-a2"} type={"text"} label={"Answer 2"}
                        style={{width: "calc(100% - 8px)"}} maxlength={255} onSumbit={() => nextButton}/>
                </InputFieldsContainer>
                <InputFieldsContainer>
                <Select ref={qusElm3} id={"security-q3"} label={"Question 3"} style={{width: "calc(100% - 8px)"}}
                        onChange={function(){
                            checkQuestionStatus(3, ansElm3);
                        }}>
                    <option value={1}>{securityQuestions()[3][0]}</option>
                    <option value={2}>{securityQuestions()[3][1]}</option>
                    <option value={3}>{securityQuestions()[3][2]}</option>
                    <option value={4}>{securityQuestions()[3][3]}</option>
                    <option value={5}>{securityQuestions()[3][4]}</option>
                    <option value={6}>{securityQuestions()[3][5]}</option>
                </Select>
                <Input ref={ansElm3} id={"security-a3"} type={"text"} label={"Answer 3"}
                        style={{width: "calc(100% - 8px)"}} maxlength={255} onSumbit={() => nextButton}/>
            </InputFieldsContainer>
            <Notice>Security questions are important. They can help you regain access to your account when you get locked out - so don't share them with anyone!</Notice>
            <Notice>When you answer your security questions, the answer needs to be in the format you first entered them. So try to write them down somewhere!</Notice>
            <ButtonsContainer>
                <Button type={"action"} function={function(){history.back()}}>Go back</Button>
                <Button ref={nextButton} type={"action"} function={function(){
                    nextCheck(nextButton, function(setError, isDone){
                        [
                            ansElm1,
                            ansElm2,
                            ansElm3
                        ].forEach(function(elm){
                            let input = elm.children[0].children[0];
                            if(input.value.length > 255){
                                setInputState(elm, false, "Can't be longer than 255 characters!");
                                setError();
                            }else if(input.value[0] == " " || input.value[input.value.length - 1] == " "){
                                setInputState(elm, false, "Can't start or end with whitespace!");
                                setError();
                            }else if(input.value.indexOf("  ") != -1){
                                setInputState(elm, false, "Can't contain consecutive whitespaces!");
                                setError();
                            }else if(!/^[a-zA-Z0-9!?@#$%&*(). ]*$/.test(input.value)){
                                setInputState(elm, false, "Can only contain letters, whitespaces, and some special characters (!?@#$%&()*.)!");
                                setError();
                            }else if(input.value.length < 5){
                                setInputState(elm, false, "Too short!");
                                setError();
                            }
                        });
                        isDone();
                    }, function(){
                        registerData.securityQuestions.q1 = Number(qusElm1.children[0].children[0].value);
                        registerData.securityQuestions.q2 = Number(qusElm2.children[0].children[0].value);
                        registerData.securityQuestions.q3 = Number(qusElm3.children[0].children[0].value);
                        registerData.securityQuestions.a1 = ansElm1.children[0].children[0].value;
                        registerData.securityQuestions.a2 = ansElm2.children[0].children[0].value;
                        registerData.securityQuestions.a3 = ansElm3.children[0].children[0].value;
                        checkDataByOrder(5, function(error){
                            if(error){
                                redoRegister(navigate, true);
                            }else{
                                navigate("/user/register/quick-settings");
                            }
                        });
                    });
                }} primary>Next</Button>
            </ButtonsContainer>
        </FlexContainer>
    </>;
}