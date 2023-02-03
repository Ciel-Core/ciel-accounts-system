/**
 * 
 * General-use functions
 * 
 **/

// Deep ""includes"
export function deepIncludes(array, value){
    if(array.includes(value)){
        return true;
    }else{
        for(let item in array){
            if(Array.isArray(item)){
                if(checkInclude(item, value)){
                    return true;
                }
            }
        }
    }
    return false;
}