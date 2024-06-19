export function formatTime(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);

    let hDisplay = h > 0 ? h + ":" : "";
    let mDisplay = m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : (h > 0 ? "00:" : "");
    let sDisplay = s < 10 ? "0" + s : s;

    return hDisplay + mDisplay + sDisplay;
}