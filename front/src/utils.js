export const isValidDate = (date) => {
    if(isNaN(Date.parse(date))) return false;

    let parts = date.split("-");
    if(parts.length !== 3) return false;
    if(parts[1].startsWith("0") || parts[2].startsWith("0")) return false;

    if(!(/^\d{4}-\d{1,2}-\d{1,2}$/.test(date))) return false;

    return true;
}

export const dateToStr = (date, normaali=false) => {
    if(!normaali) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    else {
        return `${dayName(date.getDay())} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }
}

export const dayName = (day) => {
    switch(day) {
        case 1: return "ma";
        case 2: return "ti";
        case 3: return "ke";
        case 4: return "to";
        case 5: return "pe";
        case 6: return "la";
        case 7: return "su";
        default: return null;
    }
}

export const range = (start, end) => {
    let arr = [];
    for(start; start < end; start++) {
        arr.push(start);
    }
    return arr;
}