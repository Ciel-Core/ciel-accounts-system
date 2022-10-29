/**
 * 
 * Manage the security questions
 * 
 **/

import { makeRequest } from "./loader.jsx";

export async function getSecurityQuestions(){
    return new Promise((resolve,reject)=>{
        makeRequest("/lists/security_questions.txt", function(error, data){
            if(error){
                throw error;
            }
            data = data.replace(/\r/g, "").split(/\n/g);
            resolve({
                1: data.slice(0, 6),
                2: data.slice(6, 12),
                3: data.slice(12, 18)
            });
        });
    });
}