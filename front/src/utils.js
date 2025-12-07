export const isValidDate = (date) => {
    if(isNaN(Date.parse(date))) return false;

    let parts = date.split("-");
    if(parts.length !== 3) return false;
    if(parts[1].startsWith("0") || parts[2].startsWith("0")) return false;

    if(!(/^\d{4}-\d{1,2}-\d{1,2}$/.test(date))) return false;

    return true;
}

export const dateToStr = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export const range = (start, end) => {
    let arr = [];
    for(start; start < end; start++) {
        arr.push(start);
    }
    return arr;
}