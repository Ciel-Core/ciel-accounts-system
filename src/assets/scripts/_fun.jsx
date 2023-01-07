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
        let input = false;
        e.path.forEach((elm) => {
            if((elm.tagName || "").toLowerCase() == "input"){
                input = true;
            }
        });
        if(!input){
            list.push(e.key.toLowerCase());
            while(list.length > secretWord.length){
                list.shift();
            }
            if(!isActive && list.join("") == secretWord){
                // Activate action
                isActive = true;
                callback();
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

// Await colours secret activation
export function colorsSecret(){
    // Desktop activation
    awaitKeybaordSecret("colours", colorsSwitch);
    // Mobile activation
    // ???
}