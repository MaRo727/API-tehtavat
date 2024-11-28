
function getClip() {
    text = document.getElementById('inputField').value;
    console.log(text)
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        console.log("lol");
    }
}
