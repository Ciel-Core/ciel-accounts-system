/**
 * 
 * Manage the process of saving the register data locally
 * 
 **/

import { log } from './../console.jsx';

export function loadAES(callback){
    if(typeof CryptoJS != "object"){
        let script = document.createElement('script');
        script.onload = callback;
        script.src = '/libraries/aes.js';
        document.head.appendChild(script);
    }else{
        callback();
    }
}

export function hash(data){
    return CryptoJS.MD5(data).toString();
}

function cleanRegisterDataObject () {
    return {
        name: {
            first: undefined,
            last: undefined
        },
        username: undefined,
        passwordHash: undefined,
        birthdate: {
            day: undefined,
            month: undefined,
            year: undefined
        },
        gender: undefined, // male, female, custom<String>
        pronounce: undefined, // 1 (he/him), 2 (she/her), 0 (they/them)
        securityQuestions: {
            q1: undefined, // 1-6
            q2: undefined, // 1-6
            q3: undefined, // 1-6
            a1: undefined,
            a2: undefined,
            a3: undefined
        },
        quickSettings: {
            profile: undefined, // 1 - rich, 2 - limited, 3 - hidden
            activity: undefined, // 1 - Ciel.affiliated.third-party, 2 - Ciel.affiliated, 3 - Ciel
            location: undefined, // 1 - collect location data, 2 - don't collect data
            colorScheme: undefined, // 0 - auto, 1 - light, 2 - dark
        },
        extraData: {
            registrationDisplayLanguage: undefined
        },
        agreement: undefined
    };
}

export let registerData = cleanRegisterDataObject();

export function resetRegisterData(){
    registerData = cleanRegisterDataObject();
}

export var dataOrder = {
    // /register
    1: ["name.first", "name.last"],
    // /register/username
    2: ["username"],
    // /register/password
    3: ["passwordHash"],
    // /register/personal
    4: ["birthdate.day", "birthdate.month", "birthdate.year",
    "gender", "pronounce"],
    // /register/security-questions
    5: ["securityQuestions.q1", "securityQuestions.q2", "securityQuestions.q3",
    "securityQuestions.a1", "securityQuestions.a2", "securityQuestions.a3",],
    // /register/quick-settings
    6: ["quickSettings.profile", "quickSettings.activity", "quickSettings.location",
        "quickSettings.colorScheme"],
    // /register/agreement
    7: ["agreement"],
    // /register/review
    8: ["extraData.registrationDisplayLanguage"]
}, dataSectionsN = Object.keys(dataOrder).length;

export function checkDataByOrder(section, callback){
    log(registerData);
    if(section < 1 || section > dataSectionsN){
        throw new Error("Incorrect section ID!");
    }
    let call = false;
    for (var key in dataOrder) {
        key = Number(key);
        if(key <= section){
            dataOrder[Number(key)].forEach(dataAddress => {
                dataAddress = dataAddress.split(".").reverse();
                let data = registerData[dataAddress.pop()];
                dataAddress.forEach(function(k){
                    data = data[k];
                });
                if(!call && data == undefined){
                    call = true;
                    callback(true);
                }
            });
        }
    }
    if(!call){
        callback(false);
    }
}