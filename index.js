let ans, ansName, ques, sub;
let btn = document.querySelectorAll('button');
let data = [];
let curr_index = null; // To keep track of the currently selected question

btn[0].addEventListener("click", () => {
    document.getElementById("entry-form").style.display = "block";
    document.getElementById("response-area").style.display = "none";
});

btn[1].addEventListener("click", submitQuestion);
function submitQuestion() {
    sub = document.getElementById('subject-input');
    ques = document.getElementById('question-input');
    if (sub.value && ques.value) {
        data.push({ subject: sub.value, question: ques.value, responses: [] });
        adddiv(data);
    } else {
        alert("Field Is missing");
    }
    sub.value = '';
    ques.value = '';
    document.getElementById("entry-form").style.display = "none";
    document.getElementById("response-area").style.display = "none";
}

function adddiv(get) {
    document.getElementById('entry-list').innerHTML = '';
    if (get.length > 0) {
        get.forEach((item, index) => {
            let entryDiv = document.createElement('div');
            let subjectPara = document.createElement('p');
            let questionPara = document.createElement('p');
            entryDiv.setAttribute('style', 'max-width:100%;overflow:scroll;background-color:grey;padding:1vmax; border-radius: 1vmax;margin-top:.5vmax; border:1px solid white;');
            subjectPara.id = "p1";
            questionPara.id = "p2";
            subjectPara.innerText = item.subject;
            questionPara.innerText = item.question;
            entryDiv.appendChild(subjectPara);
            entryDiv.appendChild(questionPara);
            entryDiv.dataset.index = index; // Store the index of the question
            document.getElementById('entry-list').appendChild(entryDiv);
        });
    }
}

document.getElementById('entry-list').addEventListener("click", (e) => {
    e.stopPropagation();
    let div = e.target.closest('div');
    if (div === null) {
        return;
    }
    curr_index = div.dataset.index; // Get the index of the selected question
    console.log(curr_index);
    document.getElementById('response-title').style.display = "block";
    document.getElementById("entry-form").style.display = "none";
    document.getElementById("response-area").style.display = "block";
    let subjectDisplay = document.getElementById('subject-display');
    let questionDisplay = document.getElementById('ques-display');
    let p1 = div.querySelectorAll('p')[0];
    let p2 = div.querySelectorAll('p')[1];
    subjectDisplay.innerText = p1.innerText;
    questionDisplay.innerText = p2.innerText;
    addresponse();
});

btn[2].addEventListener("click", (e) => {
    let subjectDisplay = document.getElementById('subject-display');
    let questionDisplay = document.getElementById('ques-display');
    data = data.filter(elem => elem.question !== questionDisplay.innerText && elem.subject !== subjectDisplay.innerText);
    document.getElementById('response-area').style.display = "none";
    document.getElementById('response-list').innerHTML = '';
    adddiv();
});

btn[3].addEventListener("click", submitResponse);
function submitResponse() {
    ans = document.getElementById('response-input');
    ansName = document.getElementById('name-input');
    if (ans.value && ansName.value && curr_index !== null) {
        data[curr_index].responses.push({ responder: ansName.value, answer: ans.value });
        addresponse();
    } else {
        alert("No Responder");
    }
    document.getElementById('name-input').value = '';
    document.getElementById('response-input').value = '';
}

function addresponse() {
    document.getElementById('response-list').innerHTML = '';
    if (curr_index !== null && data[curr_index].responses.length > 0) {
        data[curr_index].responses.forEach((item) => {
            let responseDiv = document.createElement('div');
            let responderNamePara = document.createElement('p');
            let responseTextPara = document.createElement('p');
            responseDiv.setAttribute('style', 'max-width:100%;overflow:scroll;padding:1vmax; border-radius: 1vmax;margin-top:.5vmax; border:1px solid white;');
            responderNamePara.id = "p1";
            responseTextPara.id = "p2";
            responderNamePara.innerText = item.responder;
            responseTextPara.innerText = item.answer;
            responseDiv.appendChild(responderNamePara);
            responseDiv.appendChild(responseTextPara);
            document.getElementById('response-list').appendChild(responseDiv);
        });
    }
}

document.getElementById('search').addEventListener("input", () => {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredData = data.filter(item =>
        item.subject.toLowerCase().includes(searchTerm) ||
        item.question.toLowerCase().includes(searchTerm)
    );
    document.getElementById('entry-list').innerHTML = '';
    adddiv(filteredData);
});