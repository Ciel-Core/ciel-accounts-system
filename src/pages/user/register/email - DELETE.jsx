/**
 * 
 * Manage the content of the sign up page (recovery email section)
 * 
 **/

import { Title } from './../../../assets/components/Title.jsx';
import { Input, Button, Notice, Mark, FlexContainer } from './../../../assets/components/CustomElements.jsx';
import { InputFieldsContainer } from './../register.jsx';
import { onMount, createSignal } from "solid-js";

export default function RegisterSecurityQuestions(props){
    const [nextText, setNextText] = createSignal("Skip");
    onMount(() => {
        let emailInput = document.getElementById("recovery-email");
        emailInput.addEventListener("input", () => {
            if(emailInput.value.replace(/\s/gi, "") == ""){
                setNextText("Skip");
            }else{
                setNextText("Next");
            }
        });
    });
    props.report();
    return <>
        <Title>Sign Up</Title>
        <h1>Add an email address</h1>
        <br/>
        <h3>Add a <Mark>recovery email address</Mark> to your account!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <InputFieldsContainer>
                <Input id={"recovery-email"} type={"text"} label={"Recovery email address"} style={{width: "calc(100% - 8px)"}} />
            </InputFieldsContainer>
            <Notice>This step is optional! Your 'recovery' email address is going to help you recover your username when you forget it. You can NOT use your email to recover a locked-out account, so be careful!</Notice>
            <FlexContainer space={"between"} horozontal no-grow>
                <Button type={"action"} function={function(){history.back()}}>Go back</Button>
                <Button type={"link"} href={"/user/register/quick-settings"} primary>{nextText()}</Button>
            </FlexContainer>
        </FlexContainer>
    </>;
}