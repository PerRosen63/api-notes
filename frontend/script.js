let main = document.getElementById('main');
let leftCol = document.getElementById('leftCol');
let docList = document.getElementById('docList');

const title = document.createElement('h2');
title.setAttribute('id', 'title');
const textResult = document.createElement('div');
textResult.setAttribute('id', 'textResult');

leftCol.prepend(textResult);
leftCol.prepend(title);

//create btn
let createBtnBox = document.createElement('createBtnBox');
main.prepend(createBtnBox);
let createBtn = document.createElement('button');
createBtn.setAttribute('id', 'createBtn');
createBtn.innerText = 'Skapa dokument';

//Edit btn
let editBtnBox = document.createElement('editBtnBox');
leftCol.appendChild(editBtnBox);
let editBtn = document.createElement('button');
editBtn.setAttribute('id', 'editBtn');
editBtn.innerText = 'Redigera dokument';


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
    toolbar: 'undo redo | | forecolor backcolor | styleselect bold italic | alignleft alignright | code',
    setup: function(editor) {
        editor.on('change', function(){
            editor.save();
        })
    }
})
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


// Knapp redigera dokument

function editDocBtn(documentId, title, content) { // från map loopen i list/print
    //console.log('edit doc btn', documentId);
    editBtnBox.appendChild(editBtn);
            
editBtn.addEventListener('click', () => {
    
    createBtnBox.innerHTML = '';
    editBtnBox.innerHTML = '';
    title.innerHTML = '';
    textResult.innerHTML = '';
    inputs.prepend(inputTitle);
    inputs.appendChild(textArea);
    tinyMce();
    
    //console.log('event edit', documentId);
    inputTitle.value = title;
    textArea.value = content;

    saveEditDoc(documentId);
    inputs.appendChild(saveEditBtn);

})

saveEditBtn.addEventListener('click', saveEditDoc);

}

// Ändra PATCH dokument

function saveEditDoc(documentId) {
    console.log('saveEditDoc', documentId);
}


// List documents sidebar

function listDoc() {        

    fetch('http://localhost:3000/documents')
    .then(res => res.json())
    .then(data => {
    
     // Title and content from Latest date document
     const latest = data.sort((a ,b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
        
     textResult.innerHTML = latest[0].content;
     title.innerText = latest[0].title;
     // End latest

     let currentId = latest[0].documentId;
     //console.log('current/latest id', currentId);

    data.map(doc => {

        let li = document.createElement('li');
        let span = document.createElement('span');
        li.innerText = doc.title + ' ';
        li.style.fontWeight = '900'; 
        span.innerText = doc.createDate;
        span.style.fontWeight = '500'; 
        docList.appendChild(li);
        li.appendChild(span);

        // Click in list to print content for clicked id
        li.addEventListener('click', () => {
            
            currentId = doc.documentId;

            //console.log('nuvarande id', currentId );

            title.innerText = doc.title;
            textResult.innerHTML = doc.content;
            inputs.innerHTML = '';
            createDocBtn();
            editDocBtn(doc.documentId, doc.title, doc.content);
            
        })

    })
    createDocBtn();
    //editDocBtn();
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


