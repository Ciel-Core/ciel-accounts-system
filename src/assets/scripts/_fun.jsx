/**
 * 
 * Fun-ctions (kill me now)
 * 
 **/

// Keyboard secret activation
function awaitKeybaordSecret(secretWord, callback){
    let list = [],
        isActive = false;
    window.addEventListener("keypress", function(e){
        // Block event if the secret is active
        if(isActive){
            return;
        }
        let input = e.target instanceof HTMLInputElement;
        // if(e.path instanceof Array){
        //     e.path.forEach((elm) => {
        //         if((elm.tagName || "").toLowerCase() == "input"){
        //             input = true;
        //         }
        //     });
        // }
        if(!input){
            // Get max secret length
            let secretLength = 0;
            for(let i = 0; i < secretWord.length; i++){
                if(secretWord[i].length > secretLength){
                    secretLength = secretWord[i].length;
                }
            }
            // Add new key to list
            while(list.length < secretLength){
                list.push("#");
            }
            list.push(e.key.toLowerCase());
            while(list.length > secretLength){
                list.shift();
            }
            // Check if a secret is present!
            for(let i = 0; i < secretWord.length; i++){
                if(list.join("").indexOf(secretWord[i]) == secretLength - secretWord[i].length){
                    // Activate secret
                    isActive = true;
                    callback();
                    break;
                }
            }
        }else{
            while(list.length > 0){
                list.pop();
            }
        }
    });
}

// Colours secret
function colorsSwitch(){
    let colorsList = ["black", "red", "blue", "orange", "yellow", "green", "purple", "pink"],
    i = 1,
    f = 0;
    document.documentElement.dataset.accentColor = colorsList[0];
    setInterval(() => {
        if(++i % 2 == 0 && i / 2 == f){
            i++;
        }
        if(i == colorsList.length * 2){
            i = 1;
            if(++f == colorsList.length){
                f = 1;
            }
            colorsList[0] = colorsList[f];
        }
        document.documentElement.dataset.accentColor = colorsList[(i % 2 == 0) ? (i/2) : 0];
    }, (((i + 1) % 2) * 150 + 50))
}

export function fun(){
    // Switch between available accent colours
    awaitKeybaordSecret(["colours", "colors"], colorsSwitch);
}