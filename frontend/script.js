let main = document.getElementById('main');

let loginBtn = document.createElement('loginBtn');

let leftCol = document.getElementById('leftCol');
let docList = document.getElementById('docList');

const title = document.createElement('h2');
title.setAttribute('id', 'title');
const textResult = document.createElement('div');
textResult.setAttribute('id', 'textResult');

leftCol.prepend(textResult);
leftCol.prepend(title);



//Create btn
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

// Delete btn

let deleteBtnBox = document.createElement('deleteBtnBox');
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
    
    // Title and content from Latest date document
    const latest = data.sort((a ,b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
   
    textResult.innerHTML = latest[0].content;
    title.innerText = latest[0].title;
    // End latest

    let currentId = latest[0].documentId;
    let currentTitle = latest[0].title;
    let currentContent = latest[0].content;
    
    let clickedArr = [];
    
    docList.innerHTML = '';

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
        li.addEventListener('click', function removeLi() {
            
            /* currentId = doc.documentId;
            currentTitle = doc.title;
            currentContent = doc.content; */
            
            clickedArr.push(doc.documentId); 
            console.log(clickedArr);  

            title.innerText = doc.title;
            textResult.innerHTML = doc.content;
            inputs.innerHTML = '';
            editDocBtn(doc.documentId, doc.title, doc.content);
            deleteBtnBox.appendChild(deleteBtn);
            deleteDocBtn(doc.documentId);
            li.removeEventListener("click", removeLi, false); //REMOVED EVENTLISTENER          
        }, true)            

        
       
    })
    //console.log('utanför', currentId);
    
    createDocBtn();

})
}

listDoc();


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
            userId: 1
        }

        /* let editDoc = {
            title: 'test title',
            content: 'test content',
            userId: 1
        } */
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


