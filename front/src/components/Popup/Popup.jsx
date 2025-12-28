import "./popup.css";

export default function Popup({popup}) {
    if(popup) {
        return <div className={`popupContainer ${popup.isError ? "popupError" : "popupInfo"}`}>{popup.text}</div>
    }
    return;    
}