let handler = null;

export const setUnauthHandler = (h) => handler = h;

export const signalUnauth = () => {
    console.log("AAAAAAAAAAAA")
    if(handler) {
        handler();
    }
}