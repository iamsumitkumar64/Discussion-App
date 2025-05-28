let ans, ansName, ques, sub;
let data = [];
let currentIndex = null;
let l_data = localStorage.getItem('l_data');

if (l_data) { //LOCAL STORAGE FETCHING IF AVAILABLE
    data = JSON.parse(l_data);
    refreshdiv(data);
}

// 🗨️🗨️ EVENT-LISTENER ON BUTTONS SECTION HERE 🗨️🗨️

document.getElementById('new-entry-btn').addEventListener("click", () => {
    document.getElementById("entry-form").style.display = "block";
    document.getElementById("response-area").style.display = "none";
});

document.getElementById('submit-question-btn').addEventListener("click", submitQuestion);
document.getElementById('submit-response-btn').addEventListener("click", submitResponse);

document.getElementById('entry-list').addEventListener("click", (e) => {
    e.stopPropagation();
    let entryDiv = e.target.closest('div');
    if (!entryDiv) return;

    const uid = entryDiv.getAttribute('data-id');
    // CLICK ON ENTRY TO STORE currentIndex FOR FURTHER PROCESS IN LEFT-PANEL
    currentIndex = data.findIndex(d => d.uid == uid);
    if (currentIndex === -1) return;
    // FAV-BUTTON CLICKED TO CHANGE AND UPDATE IN LOCALSTORAGE
    if (e.target.tagName == 'BUTTON') {
        e.target.innerHTML = e.target.innerHTML === '👎🏻' ? '❤️' : '👎🏻';
        data[currentIndex].fav = e.target.innerHTML;
        localStorage.setItem("l_data", JSON.stringify(data));
        return;
    }
    document.getElementById('response-title').style.display = "block";
    document.getElementById("entry-form").style.display = "none";
    document.getElementById("response-area").style.display = "block";
    // ENTER DETAILS IN LEFT-PANEL FROM CLICKED DIV
    document.getElementById('subject-display').innerText = data[currentIndex].subject;
    document.getElementById('ques-display').innerText = data[currentIndex].question;

    refreshresponse();
});

document.getElementById('resolvebtn').addEventListener("click", () => {
    if (currentIndex !== null) {
        const uid = data[currentIndex].uid;
        const list = document.querySelectorAll('#entry-list > div');
        list.forEach((item) => {
            // UID MATCHED DIV DELETED
            if (item.getAttribute('data-id') == uid) {
                console.log('Delete DIV =>', item.getAttribute('data-id'));
                // item.style.display = 'none';
                item.remove();
            }
        });// UPDATE DELETED IN DATA AND LOCALSTORAGE
        data.splice(currentIndex, 1);
        currentIndex = null;
        localStorage.setItem("l_data", JSON.stringify(data));
        document.getElementById('response-area').style.display = "none";
        document.getElementById('response-list').innerHTML = '';
    }
});

document.getElementById('response-list').addEventListener('click', (e) => {
    let responseDiv = e.target.closest('div');
    if (!responseDiv || currentIndex === null) return;

    const resIndex = parseInt(responseDiv.getAttribute('data-response-index'));
    if (isNaN(resIndex)) return;
    // CHANGE LIKE-DISLIKE COUNT    
    if (e.target.tagName == 'BUTTON') {
        if (e.target.innerText.includes('👎🏻')) {
            data[currentIndex].responses[resIndex].dislike++;
            e.target.innerText = `${data[currentIndex].responses[resIndex].dislike} 👎🏻`;
        }
        else if (e.target.innerText.includes('👍🏻')) {
            data[currentIndex].responses[resIndex].like++;
            e.target.innerText = `${data[currentIndex].responses[resIndex].like} 👍🏻`;
        }
        sortresponse();
    }
    localStorage.setItem("l_data", JSON.stringify(data));
});
document.getElementById('search').addEventListener("input", () => {
    searchshow(document.getElementById('search').value.toLowerCase());
});

document.getElementById('fav_icon').addEventListener("click", () => {
    const showFavs = fav_icon.innerHTML === '❤️';
    fav_icon.innerHTML = showFavs ? '👎🏻' : '❤️';
    // CHANGE FAV-ICON AND HIDE/SHOW DIV'S IN RIGHT PANEL
    document.querySelectorAll('#entry-list .entry').forEach(e_div => {
        const uid = e_div.getAttribute('data-id');
        const entryData = data.find(item => item.uid == uid);
        const isFav = entryData?.fav === '❤️';
        e_div.style.display = (!showFavs || isFav) ? 'flex' : 'none';
    });
});

// 🗨️🗨️ FUNCTION FOR UPPER-PART SECTION HERE 🗨️🗨️

function submitQuestion() {
    sub = document.getElementById('subject-input');
    ques = document.getElementById('question-input');
    if (sub.value && ques.value) {
        const uid = Date.now();
        data.push({ 'uid': uid, subject: sub.value, question: ques.value, fav: '👎🏻', responses: [] });
        localStorage.setItem("l_data", JSON.stringify(data));
        creatediv(sub.value, ques.value, uid, '👎🏻');
    } else {
        alert("Field is missing");
    }
    sub.value = '';
    ques.value = '';
    document.getElementById("entry-form").style.display = "none";
    document.getElementById("response-area").style.display = "none";
}
function submitResponse() {
    ans = document.getElementById('response-input');
    ansName = document.getElementById('name-input');

    if (ans.value && ansName.value && currentIndex !== null) {
        data[currentIndex].responses.push({ 'uid': Date.now(), responder: ansName.value, answer: ans.value, like: 0, dislike: 0 });
        let obj = { responder: ansName.value, answer: ans.value, like: 0, dislike: 0 };
        localStorage.setItem("l_data", JSON.stringify(data));
        createresponse(obj);
    } else {
        alert("Responder name or answer missing.");
    }

    document.getElementById('name-input').value = '';
    document.getElementById('response-input').value = '';
}

function createresponse(obj) {
    const responseList = document.getElementById('response-list');
    let responseDiv = document.createElement('div');
    responseDiv.setAttribute('data-response-index', currentIndex);
    responseDiv.setAttribute('style', `max-width:100%;overflow:scroll;padding:1vmax; border-radius: 1vmax;margin-top:.5vmax; border:1px solid white;order:${currentIndex};`);

    let responderNamePara = document.createElement('p');
    responderNamePara.id = "p1";
    responderNamePara.innerText = obj.responder;

    let responseTextPara = document.createElement('p');
    responseTextPara.id = "p2";
    responseTextPara.innerText = obj.answer;

    let aside = document.createElement('aside');
    let likeBtn = document.createElement('button');
    let dislikeBtn = document.createElement('button');
    likeBtn.innerHTML = `${obj.like} 👍🏻`;
    dislikeBtn.innerHTML = `${obj.dislike} 👎🏻`;

    aside.appendChild(likeBtn);
    aside.appendChild(dislikeBtn);
    responseDiv.appendChild(responderNamePara);
    responseDiv.appendChild(responseTextPara);
    responseDiv.appendChild(aside);
    responseList.appendChild(responseDiv);
}

function refreshresponse() {
    const responseList = document.getElementById('response-list');
    responseList.innerHTML = '';

    if (currentIndex !== null && data[currentIndex].responses.length > 0) {
        data[currentIndex].responses.forEach((item, i) => {
            let responseDiv = document.createElement('div');
            responseDiv.setAttribute('data-response-index', i);
            responseDiv.setAttribute('style', 'max-width:100%;overflow:scroll;padding:1vmax; border-radius: 1vmax;margin-top:.5vmax; border:1px solid white;');

            let responderNamePara = document.createElement('p');
            responderNamePara.id = "p1";
            responderNamePara.innerText = item.responder;

            let responseTextPara = document.createElement('p');
            responseTextPara.id = "p2";
            responseTextPara.innerText = item.answer;

            let aside = document.createElement('aside');
            let likeBtn = document.createElement('button');
            let dislikeBtn = document.createElement('button');
            likeBtn.innerHTML = `${item.like} 👍🏻`;
            dislikeBtn.innerHTML = `${item.dislike} 👎🏻`;

            aside.appendChild(likeBtn);
            aside.appendChild(dislikeBtn);
            responseDiv.appendChild(responderNamePara);
            responseDiv.appendChild(responseTextPara);
            responseDiv.appendChild(aside);
            responseList.appendChild(responseDiv);
        });
    }
}

function sortresponse() {
    if (currentIndex === null) return;
    let diffarr = [];
    const res_list = document.getElementById('response-list').querySelectorAll('div');
    data[currentIndex].responses.forEach(item => diffarr.push(item.like - item.dislike));
    res_list.forEach((item,index)=>{
        console.log('Diffarr[index] ',diffarr[index]);        
        console.log('index ',index);        
        item.setAttribute('style',`order:${diffarr[index]}`);
    });
}

function searchshow(searchTerm) {
    document.querySelectorAll('#entry-list > div').forEach(item => {
        let matched = false;
        // HIGHLIGHT MATCHED TEXT IN SEARCH
        item.querySelectorAll('p').forEach(p => {
            const original = p.textContent;
            const lower = original.toLowerCase();
            if (lower.includes(searchTerm)) {
                matched = true;// IF MATCHED
                p.innerHTML = highlightText(original, searchTerm);
            } else {
                p.innerHTML = original;
            }
        });
        item.style.display = matched ? 'flex' : 'none';
    });
}

function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const pattern = new RegExp(`(${searchTerm})`, 'gi');
    // class="highlight HAS COLOR AND FON-SIZE FOR HIGHLIGHT
    return text.replace(pattern, '<span class="highlight">$1</span>');
}

function refreshdiv(get) {
    document.getElementById('entry-list').innerHTML = '';
    if (get.length > 0) {
        // USE ON REFRESH PAGE TO RENDER ALL DIV'S
        get.forEach(item => {
            creatediv(item.subject, item.question, item.uid, item.fav);
        });
    }
}
function creatediv(subject, question, uid, favStatus) {
    console.log('Create DIV =>', uid);
    let entryDiv = document.createElement('div');
    let aside = document.createElement('aside');
    entryDiv.setAttribute('data-id', uid);

    entryDiv.classList.add('entry');
    entryDiv.setAttribute('style', 'max-width:100%;overflow:scroll;background-color:grey;padding:1vmax; border-radius: 1vmax;margin-top:.5vmax; border:1px solid white;');
    aside.setAttribute('style', 'display:flex;flex-direction:column;');

    let subjectPara = document.createElement('p');
    subjectPara.id = "p1";
    subjectPara.innerText = subject;

    let questionPara = document.createElement('p');
    questionPara.id = "p2";
    questionPara.innerText = question;

    let fav = document.createElement('button');
    fav.innerHTML = favStatus;

    let p = document.createElement('p');
    p.classList.add('time_portion');

    entryDiv.appendChild(subjectPara);
    entryDiv.appendChild(questionPara);
    aside.appendChild(fav);
    aside.appendChild(p);
    entryDiv.appendChild(aside);
    document.getElementById('entry-list').appendChild(entryDiv);
    time();
}

function time() {
    const time_port = document.querySelectorAll('.time_portion');
    let res = null, uid = null;

    setInterval(() => {
        time_port.forEach((item) => {
            uid = item.parentNode.parentNode.getAttribute('data-id');
            const curr_time = Date.now();
            const sec = Math.floor((curr_time - uid) / 1000);

            const hrs = Math.floor(sec / 3600);
            const mins = Math.floor((sec % 3600) / 60);
            const secs = sec % 60;

            if (hrs > 24) {
                res = `${hrs / 24}d ${hrs}h ago`;
            }
            else if (hrs > 0 || mins > 60) {
                res = `${hrs}h ${mins}m ago`;
            }
            else if (secs > 60 || mins > 0) {
                res = `${mins}m ${secs}s ago`;
            }
            else {
                res = `${secs}s ago`;
            }
            item.innerText = res;
        });
    }, 1000);
}
