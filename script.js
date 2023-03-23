const wikiApiUrl = "https://he.wikipedia.org/api/rest_v1/page/summary/";

let isWriting = false;
let isSearching = false;

const addSpace = () => {
    let output = document.querySelector(".output");
    output.innerHTML += '<br /><br /><br />';
}

const printText = (text, mix) => {
    if (isWriting) {
        return;
    }
    isWriting = true;
    let textArr = text.split(" ") || [];
    let output = document.querySelector(".output");
    output.innerHTML += "<br />";
    let index = 0;
    let print = setInterval(() => {
        if (index > textArr.length || textArr[index] == null) {
            isWriting = false;
            addSpace();
            return clearInterval(print);
        }
        let randomWord = mix ? textArr[Math.floor(Math.random() * textArr.length)].replace(/[()]/g, "") : textArr[index];
        output.innerHTML += randomWord + " " + (randomWord.match(/[?\.]/) != null ? "<br />" : "");
        output.scrollTop = output.scrollHeight;
        index++;
    }, 250);
};

const getInfo = () => {
    
    if (isSearching) {
        return;
    }

    isSearching = true;

    let text = document.querySelector(".input").value;

    if (text.trim() == "") {
        isSearching = false;
        return printText("<br/>" + "אנא הכנס קצת טקטסט כדי לחפש. הכנס קצת טקטס כדי להתחיל שיחה. אפשר לשאול שאלה על כל נושא");
    }

    document.querySelector(".input").value = '';

    let mainWord = text.replaceAll(" ", "_") 

    fetch(wikiApiUrl + mainWord)
        .then((res) => {
            if (!res.ok) {
                return "";
            }
            return res.json();
        })
        .then((text) => {
            if (text == '') {
                isSearching = false;
                return printText("לא מצאתי איפורמציה לגבי מה ששאלת. אולי תשאל משהו אחר?"); 
            }            

            printText( text?.description + ' ' + text?.extract + (text?.extract.length < 300 ? (' ' + text?.extract) : '' ), true);
            isSearching = false;
        })
        .catch((err) => {
            printText("לא מצאתי איפורמציה לגבי מה ששאלת. אולי תשאל משהו אחר?");
            isSearching = false;
        });
};

// document.querySelector(".input").addEventListener("input", (e) => {
//     e.target.value = gibToHeb(e.target.value)
// });

document.querySelector(".button").addEventListener("click", () => {
    getInfo();
});

document.querySelector(".input").addEventListener("keydown", (e) => {
    if (e.code === "Enter") { 
        getInfo();
    }
});

printText("שלום. מה נשמע? הכנס קצת טקטס כדי להתחיל שיחה. אפשר לשאול שאלה על כל נושא");
