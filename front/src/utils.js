import moment from "moment";

export const isValidDate = (date) => {
    if(isNaN(Date.parse(date))) return false;

    let parts = date.split("-");
    if(parts.length !== 3) return false;
    if(parts[1].startsWith("0") || parts[2].startsWith("0")) return false;

    if(!(/^\d{4}-\d{1,2}-\d{1,2}$/.test(date))) return false;

    return true;
}

export const dateToStr = (date, normaali=false) => {
    date = typeof date === Date ? date : new Date(Date.parse(date));

    if(!normaali) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    else {
        return `${dayName(date.getDay())} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }
}

export const weekNum = (_date) => {
    const date = typeof _date === Date ? _date : new Date(Date.parse(_date));
    const now = moment(date);
    return now.isoWeek();

    /* 
    // https://weeknumber.com/how-to/javascript
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    */
}

export const dayName = (day) => {
    switch(day) {
        case 1: return "ma";
        case 2: return "ti";
        case 3: return "ke";
        case 4: return "to";
        case 5: return "pe";
        case 6: return "la";
        case 0: return "su";
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