let main = document.getElementById('main');

// Log in
const loginBox = document.getElementById('loginBox');

let userInput = document.createElement('input');
userInput.setAttribute('id', 'userInput');
userInput.setAttribute('placeholder', 'User:')

let passInput = document.createElement('input');
passInput.setAttribute('id', 'passInput');
passInput.setAttribute('placeholder', 'Password:');

let loginBtn = document.createElement('button');
loginBtn.setAttribute('id', 'loginBtn');


// Skapa user

const userRegBox = document.getElementById('userRegBox');

let userRegInput = document.createElement('input');
userRegInput.setAttribute('id', 'userRegInput');
userRegInput.setAttribute('placeholder', 'Register user:');

let passRegInput = document.createElement('input');
passRegInput.setAttribute('id', 'passRegInput');
passRegInput.setAttribute('placeholder', 'Register password:');

let regBtn = document.createElement('button');
regBtn.setAttribute('id', 'regBtn');
regBtn.innerText = 'Registrera användare!';


// Get containers
let leftCol = document.getElementById('leftCol');
let docList = document.getElementById('docList');

const title = document.createElement('h2');
title.setAttribute('id', 'title');
const textResult = document.createElement('div');
textResult.setAttribute('id', 'textResult');

//Create btn
let createBtnBox = document.createElement('div');
createBtnBox.setAttribute('id', 'createBtnBox');
main.prepend(createBtnBox);
let createBtn = document.createElement('button');
createBtn.setAttribute('id', 'createBtn');
createBtn.innerText = 'Skapa dokument';


leftCol.prepend(textResult);
leftCol.prepend(title);


//Edit btn
let editBtnBox = document.createElement('div');
editBtnBox.setAttribute('id', 'editBtnBox');
leftCol.appendChild(editBtnBox);
let editBtn = document.createElement('button');
editBtn.setAttribute('id', 'editBtn');
editBtn.innerText = 'Redigera dokument';

// Delete btn
let deleteBtnBox = document.createElement('div');
deleteBtnBox.setAttribute('id', 'deleteBtnBox');
leftCol.appendChild(deleteBtnBox);
let deleteBtn = document.createElement('button');
deleteBtn.setAttribute('id', 'deleteBtn');
deleteBtn.innerText = 'Radera dokument';

// Inputs
let inputs = document.createElement('div');
inputs.setAttribute('id', 'inputs');
leftCol.appendChild(inputs);

let inputTitle = document.createElement('input');
inputTitle.setAttribute('type', 'text');
let textArea = document.createElement('textarea');
textArea.setAttribute('id', 'textArea');

// Spara skapat dokument
let saveBtn = document.createElement('button');
saveBtn.setAttribute('id', 'saveBtn');
saveBtn.innerText = 'Spara dokument';

// Spara redigerat dokument
let saveEditBtn = document.createElement('button');
saveEditBtn.setAttribute('id', 'saveEditBtn');
saveEditBtn.innerText = 'Spara ändrat dokument';


/*****************TinyMCE *************/

function tinyMce() {
    //console.log('init TinyMCE');
tinymce.init({
    selector: '#textArea',
    //target: textArea,
    plugins: 'code',
    toolbar: 'undo redo | forecolor backcolor | styleselect bold italic | alignleft alignright | code',
    setup: function(editor) {
        editor.on('change', function(){
            editor.save();
        })
    }
})
}

// Check if logged in

if (localStorage.getItem('id')) {
    printLogOutBtn();
    listDoc();
} else {
    printLogInBtn();
}

/*******************Skapa user********************/
regBtn.addEventListener('click', () => {
    console.log('loginbtn');

    let regUser = {
        userName: userRegInput.value,
        password: passRegInput.value
    }
console.log(regUser);
    fetch('http://localhost:3000/users/', {
    method:'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(regUser)
    })
    .then(res => res.json())
    .then(data => {
        console.log('ny user', data);
    
    })

})
/**********************Login user**********************/

loginBtn.addEventListener('click', () => {
    console.log('loginbtn');

    let loginUser = {
        userName: userInput.value,
        password: passInput.value
    }

    fetch('http://localhost:3000/users/login/', {
    method:'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginUser)
    })
    .then(res => res.json())
    .then(data => {
        console.log('id', data);

        
        //logga in eller ut

        if (localStorage.getItem('id')) { //klick ut
            localStorage.removeItem('id');
            leftCol.innerHTML = '';
            docList.innerHTML = '';
            createBtnBox.innerHTML = '';
            printLogInBtn();
        } else {
            localStorage.setItem('id', JSON.stringify(data)); //klick in
            //listDoc();
            
            printLogOutBtn();    
        }
        
       
    })
    
})

function printLogOutBtn() {
    userRegBox.innerHTML = '';
    loginBox.innerHTML = '';
    loginBox.appendChild(loginBtn);
    loginBtn.innerText = 'Logga ut';
    listDoc();
}

function printLogInBtn() {
    loginBox.appendChild(userInput);
    loginBox.appendChild(passInput);
    loginBox.appendChild(loginBtn);
    loginBtn.innerText = 'Logga in';
    userRegBox.appendChild(userRegInput);
    userRegBox.appendChild(passRegInput);
    userRegBox.appendChild(regBtn);
}



// Knapp Skapa dokument

function createDocBtn() {
    createBtnBox.appendChild(createBtn);
}
            
createBtn.addEventListener('click', () => {
    console.log('createDocBtn');

    createBtnBox.innerHTML = '';
    editBtnBox.innerHTML = '';
    title.innerHTML = '';
    textResult.innerHTML = '';
    inputs.prepend(inputTitle);
    inputs.appendChild(textArea);
    tinyMce();
    inputs.appendChild(saveBtn);
})  

// Knapp radera dokument

function deleteDocBtn(documentId) {
    console.log('test', documentId);
            
deleteBtn.addEventListener('click', function deleteDocBtn() {
    console.log('deleteDocBtn', documentId);

    fetch('http://localhost:3000/documents/' + documentId, {
        method:'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        console.log('raderad', documentId);
        listDoc();
    })
})
}

// List documents sidebar

function listDoc() {        

    fetch('http://localhost:3000/documents')
    .then(res => res.json())
    .then(data => {

    // Ta fram dokument för inloggad
    const userIdDocs = data.filter((doc) => doc.userId == localStorage.getItem('id'));
    console.log('userIdDocs', userIdDocs);
    
    // Title and content from Latest date document
    /* const latest = data.sort((a ,b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
   
    textResult.innerHTML = latest[0].content;
    title.innerText = latest[0].title; */
    // End latest

    /* let currentId = latest[0].documentId;
    let currentTitle = latest[0].title;
    let currentContent = latest[0].content; */
        
    docList.innerHTML = '';

    userIdDocs.map(doc => {

        let li = document.createElement('li');
        let span = document.createElement('span');
        li.innerText = doc.title + ' ';
        li.style.fontWeight = '900'; 
        span.innerText = doc.createDate;
        span.style.fontWeight = '500'; 
        docList.appendChild(li);
        li.appendChild(span);

        // Click in list to print content for clicked id
        li.addEventListener('click', function removeLi() {

            title.innerText = doc.title;
            textResult.innerHTML = doc.content;
            inputs.innerHTML = '';
            deleteBtnBox.appendChild(deleteBtn);
            deleteDocBtn(doc.documentId);
            editDocBtn(doc.documentId, doc.title, doc.content);
            li.removeEventListener("click", removeLi, false); //REMOVED EVENTLISTENER          
        }, true)            
       
    })
    
    createDocBtn();

})
}

//listDoc();


// Knapp redigera dokument

function editDocBtn(documentId, title, content) { // från map loopen i list/print
/********************************************************** */

console.log('edit doc btn', documentId);
    editBtnBox.appendChild(editBtn);

    // Redigera
    editBtn.addEventListener('click', function remove() {
        //editDocBtn(documentId, title, content);
        
        createBtnBox.innerHTML = '';
        editBtnBox.innerHTML = '';
        title.innerHTML = '';
        textResult.innerHTML = '';
        inputs.prepend(inputTitle);
        inputs.appendChild(textArea);
        tinyMce();
        
        console.log('redigera', documentId);
        inputTitle.value = title;
        textArea.value = content;

        inputs.appendChild(saveEditBtn);
        
        editBtn.removeEventListener("click", remove, false);//REMOVED EVENTLISTENER
    }, false)

  /******************************************* */  
    // Spara ändringar PATCH dokument

    saveEditBtn.addEventListener('click', function clicked() {
        
        let editDoc = {
            title: inputTitle.value,
            content: textArea.value,
            userId: localStorage.getItem('id')
        }

        console.log('id', documentId);
        console.log('spara', editDoc);
        
        fetch('http://localhost:3000/documents/' + documentId, {
        method:'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editDoc)
        })
        .then(res => res.json())
        .then(data => {
            console.log('spara doc', textArea.value);
        })
        inputTitle.value = '';
        textArea.value = '';
        docList.innerHTML = '';
        inputs.innerHTML = '';
        listDoc();

        saveEditBtn.removeEventListener("click", clicked, false);//REMOVED EVENTLISTENER
    }, false)
}


// Skapa POST dokument

    saveBtn.addEventListener('click', () => {
        //console.log('savebtn');

        let saveDoc = {
            title: inputTitle.value,
            content: textArea.value,
            userId: localStorage.getItem('id')
        }

        console.log('localStorage', localStorage.getItem('id'));

        fetch('http://localhost:3000/documents', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(saveDoc)
        })
        .then(res => res.json())
        .then(data => {
            console.log('spara doc', textArea.value);
        })
        inputTitle.value = '';
        textArea.value = '';
        docList.innerHTML = '';
        inputs.innerHTML = '';
        listDoc();

        
    })


