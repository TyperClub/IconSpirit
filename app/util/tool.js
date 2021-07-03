function insertStr(soure, start, newStr){   
    return soure.slice(0, start) + newStr + soure.slice(start);
}

function hex2int(hex) {  
    var len = hex.length, a = new Array(len), code;  
    for (var i = 0; i < len; i++) {  
        code = hex.charCodeAt(i);  
        if (48<=code && code < 58) {  
            code -= 48;  
        } else {  
            code = (code & 0xdf) - 65 + 10;  
        }  
        a[i] = code;  
    }  
      
    return a.reduce(function(acc, c) {  
        acc = 16 * acc + c;  
        return acc;  
    }, 0);  
}

module.exports = {
    insertStr,
    hex2int
};