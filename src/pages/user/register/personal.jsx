/**
 * 
 * Manage the content of the sign up page (personal info section)
 * 
 **/

import { Title } from './../../../assets/components/Title.jsx';
import { Help } from './../../../assets/components/Help.jsx';
import { Input, Select, Button, Notice, Mark, FlexContainer, setInputState, showDialog } from './../../../assets/components/CustomElements.jsx';
import { InputFieldsContainer, clientDataCheck, nextCheck, redoRegister, ButtonsContainer } from './../register.jsx';
import { onCleanup, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { registerData, checkDataByOrder } from './../../../assets/scripts/pages/registerData.jsx';
import { textProfanity } from '../../../assets/scripts/filter.jsx';

export default function RegisterPersonalInfo(props){
    let navigate = useNavigate(),
        nextButton, bDay, bMonth, bYear, gender, customGenderName, customGenderPronouns,
        genderChangeFunc = function(){
            let value = document.getElementById("gender").value;
            if(value != "custom"){
                if(customGenderPronouns.style.display != "none"){
                    customGenderPronouns.style.display = "none";
                    customGenderName.style.display = "none";
                    document.getElementById("custom-gender-pronouns").selectedIndex  = 1;
                    document.getElementById("custom-gender-name").value = "FILL";
                }
            }else{
                document.getElementById("custom-gender-pronouns").selectedIndex  = 0;
                document.getElementById("custom-gender-name").value = "";
                customGenderPronouns.style.display = null;
                customGenderName.style.display = null;
            }
        };
    onMount(() => {
        if(registerData.birthdate.day != undefined){
            bDay.children[0].children[0].value = registerData.birthdate.day;
        }
        if(registerData.birthdate.month != undefined){
            bMonth.children[0].children[0].value = registerData.birthdate.month;
        }
        if(registerData.birthdate.year != undefined){
            bYear.children[0].children[0].value = registerData.birthdate.year;
        }
        if(registerData.gender != undefined){
            if(
                (registerData.gender == "Male" && registerData.pronounce == 1) ||
                (registerData.gender == "Female" && registerData.pronounce == 2) ||
                (registerData.gender == "Unknown" && registerData.pronounce == 0)){
                gender.children[0].children[0].value = registerData.gender.toLowerCase();
            }else{
                gender.children[0].children[0].value = "custom";
                genderChangeFunc();
                customGenderName.children[0].children[0].value = registerData.gender;
            }
        }
        if(registerData.pronounce != undefined){
            customGenderPronouns.children[0].children[0].value = registerData.pronounce;
        }
        clientDataCheck(nextButton, "birthday_month", "birthday_day", "birthday_year",
                            "gender", "custom-gender-name", "custom-gender-pronouns");
        checkDataByOrder(3, function(error){
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
        <Help feed={"register"}/>
        <h1>Let's get personal!</h1>
        <br/>
        <h3>Enter your <Mark>personal details</Mark>!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <InputFieldsContainer>
                <FlexContainer horozontal style={{margin: 0}}>
                    <Select ref={bMonth} id={"birthday_month"} label={"Month"}
                            style={{"min-width": "40%", "margin-bottom": "auto"}}>
                                <option value={"1"}>January</option>
                                <option value={"2"}>February</option>
                                <option value={"3"}>March</option>
                                <option value={"4"}>April</option>
                                <option value={"5"}>May</option>
                                <option value={"6"}>June</option>
                                <option value={"7"}>July</option>
                                <option value={"8"}>August</option>
                                <option value={"9"}>September</option>
                                <option value={"10"}>October</option>
                                <option value={"11"}>November</option>
                                <option value={"12"}>December</option>
                            </Select>
                    <Input ref={bDay} id={"birthday_day"} type={"number"} label={"Day"} autocomplete={"bday-day"}
                            style={{"margin-bottom": "auto"}} onSumbit={() => nextButton}/>
                    <Input ref={bYear} id={"birthday_year"} type={"number"} label={"Year"} autocomplete={"bday-year"}
                            style={{"margin-bottom": "auto", "min-width": "calc(28% + 8px)"}} onSumbit={() => nextButton}/>
                </FlexContainer>
                <Notice smaller>Enter your birthday</Notice>
                <Select ref={gender} id={"gender"} label={"Gender"} style={{width: "calc(100% - 8px)"}}
                        onChange={genderChangeFunc}>
                    <option value={"male"}>Male</option>
                    <option value={"female"}>Female</option>
                    <option value={"unknown"}>Prefer not to say</option>
                    <option value={"custom"}>Custom</option>
                </Select>
                <Input ref={customGenderName} id={"custom-gender-name"} type={"text"}
                        label={"Gender name"} style={{width: "calc(100% - 8px)", display: "none"}}
                        value={"FILL"} maxlength={32} onSumbit={() => nextButton}/>
                <Select ref={customGenderPronouns} id={"custom-gender-pronouns"}
                        label={"Prefered pronouns"}
                        style={{width: "calc(100% - 8px)", display: "none"}} selectedIndex={1}>
                            <option value={1}>he/him</option>
                            <option value={2}>she/her</option>
                            <option value={0}>they/them</option>
                </Select>
            </InputFieldsContainer>
            <Notice>Make sure to use your real date of birth. You can create a {import.meta.env.VITE_NAME} account as long as you are 13+ years old! (access to external services will be limited depending on your age)</Notice>
            <ButtonsContainer>
                <Button type={"action"} function={function(){history.back()}}>Go back</Button>
                <Button ref={nextButton} type={"action"} function={function(){
                    nextCheck(nextButton, function(setError, isDone, error){
                        let bDayInput = bDay.children[0].children[0],
                            bYearInput = bYear.children[0].children[0],
                            bMonthInput = bMonth.children[0].children[0],
                            genderInput = gender.children[0].children[0],
                            customGenderNameInput = customGenderName.children[0].children[0],
                            currentYear = (new Date()).getFullYear();
                        // Check year
                        if(Number(bYearInput.value) < (currentYear - 120) || Number(bYearInput.value) > currentYear){
                            setInputState(bYear, false, "Invalid year!");
                            setError();
                        }
                        // Check day
                        if(Number(bDayInput.value) < 1 || Number(bDayInput.value) > 31){
                            setInputState(bDay, false, "Invalid day!");
                            setError();
                        }else if(bMonthInput.value == "1" || bMonthInput.value == "3" ||
                                    bMonthInput.value == "5" || bMonthInput.value == "7" ||
                                    bMonthInput.value == "8" || bMonthInput.value == "10" ||
                                    bMonthInput.value == "12"){
                            if(Number(bDayInput.value) > 31){
                                setInputState(bDay, false, "Invalid day!");
                                setError();
                            }
                        }else if(bMonthInput.value == "4" || bMonthInput.value == "6" ||
                                    bMonthInput.value == "9" || bMonthInput.value == "11"){
                            if(Number(bDayInput.value) > 30){
                                setInputState(bDay, false, "Invalid day!");
                                setError();
                            }
                        }else{
                            // Check if the year is a leap year
                            let year = Number(bYearInput.value),
                                max = ((0 == year % 4) && (0 != year % 100) || (0 == year % 400)) ? 29 : 28;
                            if(Number(bDayInput.value) > max){
                                setInputState(bDay, false, "Invalid day!");
                                setError();
                            }
                        }
                        if(!error[0]){
                            let ageInMilliseconds = new Date() - new Date(`${bYearInput.value}-${bMonthInput.value}-${bDayInput.value}`),
                                ageInYears = Math.floor(ageInMilliseconds/1000/60/60/24/365);
                            if(ageInYears < 13){
                                showDialog("Cannot create an account!", `You cannot use ${import.meta.env.VITE_NAME} or any of its affiliated services when you're under the age of 13.`, [
                                    ["Ok", function(dialog, remove){
                                        setInputState(bYear, false, "");
                                        remove();
                                    }]
                                ])
                                setError();
                            }
                        }
                        if(genderInput.value == "custom"){
                            if(customGenderNameInput.value.length > 32){
                                setInputState(customGenderName, false, "Can't be longer than 32 characters!");
                                setError();
                            }else if(!/^[a-zA-Z\s]+$/.test(customGenderNameInput.value)){
                                setInputState(customGenderName, false, "Can only contain letters and whitespaces!");
                                setError();
                            }else if(customGenderNameInput.value[0] == " " || customGenderNameInput.value[customGenderNameInput.value.length - 1] == " "){
                                setInputState(customGenderName, false, "Can't start or end with whitespace!");
                                setError();
                            }else if(customGenderNameInput.value.indexOf("  ") != -1){
                                setInputState(customGenderName, false, "Can't contain consecutive whitespaces!");
                                setError();
                            }
                            textProfanity(customGenderNameInput.value).then(function(status){
                                if(status){
                                    setInputState(customGenderName, false, "Profanity not allow!");
                                    setError();
                                }
                                isDone();
                            });
                        }else{
                            isDone();
                        }
                    }, function(){
                        registerData.birthdate.day = Number(bDay.children[0].children[0].value);
                        registerData.birthdate.month = Number(bMonth.children[0].children[0].value);
                        registerData.birthdate.year = Number(bYear.children[0].children[0].value);
                        let genderValue = gender.children[0].children[0].value,
                            processGenderName = (gender) => {
                                return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
                            };
                        if(genderValue == "custom"){
                            registerData.gender = processGenderName(customGenderName.children[0].children[0].value);
                            registerData.pronounce = Number(customGenderPronouns.children[0].children[0].value);
                        }else{
                            registerData.gender = processGenderName(genderValue);
                            if(registerData.gender == "Male"){
                                registerData.pronounce = 1; // He/Him
                            }else if(registerData.gender == "Female"){
                                registerData.pronounce = 2; // She/Her
                            }else{
                                registerData.pronounce = 0; // They/Them
                            }
                        }
                        checkDataByOrder(4, function(error){
                            if(error){
                                redoRegister(navigate, true);
                            }else{
                                navigate("/user/register/security-questions");
                            }
                        });
                    });
                }} primary>Next</Button>
            </ButtonsContainer>
        </FlexContainer>
    </>;
}