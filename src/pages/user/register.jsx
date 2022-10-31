/**
 * 
 * Manage the content of the sign up page
 * 
 **/

import style from './../../assets/styles/pages/user.register.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { Input, setInputState, Button, Notice, Mark, FlexContainer, showDialog } from './../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { registerData, resetRegisterData } from './../../assets/scripts/pages/registerData.jsx';
import { textProfanity } from '../../assets/scripts/filter.jsx';

import ExpandDownIcon from './../../assets/icons/expand_down.svg';

export function InputFieldsContainer(props){
    return (<div style={{width: "100%", position: "relative", overflow: "hidden"}}>{props.children}</div>);
}

export function clientDataCheck(buttonElm, ...elmIDs){
    let inputElms = [],
        selectElms = [];
    buttonElm.setAttribute("disabled", "");
    function updateButton(){
        buttonElm.removeAttribute("disabled");
        for(let i = 0; i < inputElms.length; i++){
            if(inputElms[i].value.replace(/\s/gi, "") == ""){
                buttonElm.setAttribute("disabled", "");
                break;
            }
        }
        for(let i = 0; i < selectElms.length; i++){
            if(selectElms[i].selectedIndex < 1){
                buttonElm.setAttribute("disabled", "");
                break;
            }
        }
    }
    elmIDs.forEach(function(elmID){
        let elm = document.getElementById(elmID);
        if(elm.tagName == "INPUT"){
            inputElms.push(elm);
            elm.oninput = updateButton;
        }else if(elm.tagName == "SELECT"){
            selectElms.push(elm);
            elm.addEventListener('change', updateButton);
        }else{
            throw new Error("Unexpected element!");
        }
    });
    updateButton();
    return updateButton;
}

export function nextCheck(button, callback, action){
    let localContent = document.getElementById("local-content");

    // Disable the button to prevent duplicate requests
    button.setAttribute("disabled", "");
    localContent.dataset.processing = true;

    let error = [false], calledDone = false, done = function(...args){
        if(!calledDone){
            calledDone = true;
            button.removeAttribute("disabled");
            localContent.dataset.processing = false;
            if(!error[0]){
                action(...args);
            }
        }
    };

    callback(function(){
        error[0] = true;
        done();
    }, done, error);
}

export function redoRegister(navigate, prompt = false){
    resetRegisterData();
    if(prompt){
        showDialog("Something went wrong!", "It looks like some of your registration data is missing!", [
            ["Refill info", function(dialog, remove){
                navigate("/user/register", { replace: true });
                remove();
            }]
        ]);
    }else{
        navigate("/user/register", { replace: true });
    }
}

export function ButtonsContainer(props){
    let flexContainer;
    onMount(() => {
        var observer = new IntersectionObserver(function(entries) {
            if(entries[0].intersectionRatio === 0)
                flexContainer.dataset.sticky = true;
            else if(entries[0].intersectionRatio === 1)
                flexContainer.dataset.sticky = false;
        }, { threshold: [0,1] });
        observer.observe(flexContainer);
        var observer = new IntersectionObserver( 
            ([e]) => flexContainer.dataset.sticky = e.intersectionRatio < 1,
        {threshold: [1]});
        observer.observe(flexContainer)
    });
    return (<FlexContainer ref={flexContainer} class={style.buttonsStickyContainer} space={"between"} horozontal no-grow>
            <ExpandDownIcon tabindex={0} onClick={function(){window.scrollTo(0, window.scrollY + window.innerHeight/2)}}/>
            {props.children}
        </FlexContainer>);
}

export default function Register(props){
    let navigate = useNavigate(),
        nextButton, firstName, lastName;
    onMount(() => {
        if(registerData.name.first != undefined){
            firstName.children[0].children[0].value = registerData.name.first;
        }
        if(registerData.name.last != undefined){
            lastName.children[0].children[0].value = registerData.name.last;
        }
        clientDataCheck(nextButton, "first_name", "last_name");
        props.pageLoaded();
    });
    onCleanup(() => {
        props.pageUnloading();
    });
    return <>
        <Title>Sign Up</Title>
        <h1>Create a Ciel account</h1>
        <br/>
        <h3>Enter your <Mark>first name</Mark> and <Mark>last name</Mark>!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <InputFieldsContainer>
                <Input ref={firstName} id={"first_name"} type={"text"} label={"First name"} autocomplete={"given-name"}
                        style={{width: "calc(100% - 8px)"}}/>
                <Input ref={lastName} id={"last_name"} type={"text"} label={"Last name"} autocomplete={"family-name"}
                        style={{width: "calc(100% - 8px)"}}/>
            </InputFieldsContainer>
            <Notice>It's recommended to use a device that you own and use frequently to create your Ciel account!</Notice>
            <ButtonsContainer>
                <Button type={"link"} href={"/user/login"}>Sign in instead</Button>
                <Button ref={nextButton} type={"action"} function={function(){
                        nextCheck(nextButton, function(setError, isDone){
                            let firstNameInput = firstName.children[0].children[0],
                                lastNameInput = lastName.children[0].children[0],
                                calls = 0, // [MAX, Cur]
                                checkRStatus = function(){
                                    calls++;
                                    if(calls == 2)
                                        isDone();
                                };
                            [
                                [firstNameInput, firstName],
                                [lastNameInput, lastName]
                            ].forEach(function(elms){
                                if(!/^[a-zA-Z]+$/.test(elms[0].value)){
                                    setInputState(elms[1], false, "Can only contain letters!");
                                    setError();
                                }else{
                                    textProfanity(elms[0].value).then(function(status){
                                        if(status){
                                            setInputState(elms[1], false, "Profanity not allow!");
                                            setError();
                                        }
                                        checkRStatus();
                                    });
                                }
                            });
                        }, function(){
                            registerData.name.first = firstName.children[0].children[0].value;
                            registerData.name.last = lastName.children[0].children[0].value;
                            navigate("/user/register/username");
                        });
                    }} primary>Next</Button>
            </ButtonsContainer>
        </FlexContainer>
    </>;
}