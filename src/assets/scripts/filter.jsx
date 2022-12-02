/**
 * 
 * Manage the profanity filter
 * 
 **/

import { makeRequest } from "./loader.jsx";

export async function textProfanity(text){
    return new Promise((resolve,reject)=>{
        makeRequest("/lists/banned_words.txt", function(error, data){
            if(error){
                throw error;
            }
            let status = false,
                lcText = text.toLowerCase();
            data = data.replace(/\r/g, "").toLowerCase().split(/\n/g);
            data.forEach(bWord => {
                let i = lcText.indexOf(bWord);
                if(i != -1){
                    // Check if the bad word is not a part of another word
                    if(
                        ((i + bWord.length) < text.length && (
                                (/^[a-z]*$/g.test(text[i + bWord.length - 1])
                                    && /^[A-Z]*$/g.test(text[i + bWord.length])) || // .aA
                                (/^[A-Z]*$/g.test(text[i + bWord.length - 1])
                                    && /^[a-z]*$/g.test(text[i + bWord.length])) || // .Az
                                (!(/^[a-z]*$/g.test(lcText[i + bWord.length]))) // .a# ,.A#
                            )) ||
                        (text.length == (i + bWord.length))
                    ){
                        if(i > 0){ // Not at the start of the string
                            if(/^[a-z]*$/g.test(text[i - 1]) && /^[A-Z]*$/g.test(text[i])){ //aA
                                status = true;
                            }else if(/^[A-Z]*$/g.test(text[i]) &&
                                        /^[A-Z]*$/g.test(text[i - 1])){ // AA
                                status = true;
                            }else if(!/^[a-z]*$/g.test(lcText[i - 1])){ //#a ,#A
                                status = true;
                            }
                        }else{
                            status = true;
                        }
                    }
                }
            });
            resolve(status);
        });
    });
}