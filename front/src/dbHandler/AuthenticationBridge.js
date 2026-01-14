let handler = null;

export const setUnauthHandler = (h) => handler = h;

export const signalUnauth = () => {
    if(handler) {
        handler();
    }
}