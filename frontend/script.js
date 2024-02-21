const h1 = document.getElementById('title1');

let main = document.getElementById('main');
let leftCol = document.getElementById('leftCol');
let docList = document.getElementById('docList');

const title = document.createElement('h2');
title.setAttribute('id', 'title');
const textResult = document.createElement('div');
textResult.setAttribute('id', 'textResult');

let createBtnBox = document.createElement('createBtnBox');
main.prepend(createBtnBox);
let createBtn = document.createElement('button');
createBtn.setAttribute('id', 'createBtn');
createBtn.innerText = 'Skapa dokument';

let editBtnBox = document.editElement('editBtnBox');
main.prepend(editBtnBox);
let editBtn = document.editElement('button');
editBtn.setAttribute('id', 'editBtn');
editBtn.innerText = 'Redigera dokument';


let inputs = document.createElement('div');
inputs.setAttribute('id', 'inputs');
leftCol.appendChild(inputs);

let inputTitle = document.createElement('input');
inputTitle.setAttribute('type', 'text');
let textArea = document.createElement('textarea');
textArea.setAttribute('id', 'textArea');
let saveBtn = document.createElement('button');
saveBtn.setAttribute('id', 'saveBtn');
saveBtn.innerText = 'Spara dokument';

//let li = document.createElement('li');
//let span = document.createElement('span');

function tinyMce() {
    console.log('init TinyMCE');
tinymce.init({
    selector: '#textArea',
    //target: textArea,
    plugins: 'code',
    toolbar: 'undo redo | | forecolor backcolor | styleselect bold italic | alignleft alignright | code',
    setup: function(editor) {
        editor.on('change', function(){
            editor.save();
        })
    }
})
}


/* docList.addEventListener('click', () => {
    createDocBtn();
    }) */

// Knapp Skapa dokument

function createDocBtn() {
    createBtnBox.appendChild(createBtn);
}
            
createBtn.addEventListener('click', () => {
    console.log('createDOcBtn');

    createBtnBox.innerHTML = '';
    title.innerHTML = '';
    textResult.innerHTML = '';
    inputs.prepend(inputTitle);
    inputs.appendChild(textArea);
    tinyMce();
    inputs.appendChild(saveBtn);
})    


// Print documents

/* function printDoc() {
    fetch('http://localhost:3000/documents')
    .then(res => res.json())
    .then(data => {
        
        // Title and content from Latest date document
        const latest = data.sort((a ,b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
        
        leftCol.appendChild(title);
        title.innerText = latest[0].title;
        leftCol.appendChild(textResult);
        textResult.innerHTML = latest[0].content;
        //End latest

        listDoc();

        createDocBtn();

        
    })
} */

//printDoc();



// List documents sidebar

function listDoc() {        

    fetch('http://localhost:3000/documents')
    .then(res => res.json())
    .then(data => {
    
     // Title and content from Latest date document
     const latest = data.sort((a ,b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
        
     leftCol.appendChild(title);
     title.innerText = latest[0].title;
     leftCol.appendChild(textResult);
     textResult.innerHTML = latest[0].content;
     //End latest

     let currentId = latest[0].documentId;
     console.log('current/latest id', currentId);

    data.map(doc => {

        let li = document.createElement('li');
        let span = document.createElement('span');
        li.innerText = doc.title + ' ';
        li.style.fontWeight = '900'; 
        span.innerText = doc.createDate;
        span.style.fontWeight = '500'; 
        docList.appendChild(li);
        li.appendChild(span);

        // Click in list to print content
        li.addEventListener('click', () => {
            
            currentId = doc.documentId;

            console.log('nuvarande id', currentId );
            title.innerText = doc.title;
            textResult.innerHTML = doc.content;
            inputs.innerHTML = '';
            createDocBtn();
            
        })
    })
    createDocBtn();
    })
}

listDoc();

// Skapa POST dokument

    saveBtn.addEventListener('click', () => {
        //console.log('savebtn');

        let saveDoc = {
            title: inputTitle.value,
            content: textArea.value,
            userId: 1
        }

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


