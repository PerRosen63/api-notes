/* tinymce.init({
    selector: '#textContent',
    plugins: 'code',
    toolbar: 'undo redo | | forecolor backcolor | styleselect bold italic | alignleft alignright | code',
    setup: function(editor) {
        editor.on('change', function(){
            editor.save();
        })
    }
}) */
// Tiny MCE
/* document.getElementById('saveBtn').addEventListener('click', function() {
    console.log(document.getElementById('textContent').value);
    document.getElementById('textResult').innerHTML = document.getElementById('textContent').value;
}) */

// Print documents

let docList = document.getElementById('docList');
let title = document.getElementById('title');
let textResult = document.getElementById('textResult');

function printDoc() {
    fetch('http://localhost:3000/documents')
    .then(res => res.json())
    .then(data => {
        //console.log(data);

        const latest = data.sort((a ,b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
        console.log('latest', latest[0]);
        //const latestTitle = latest[0].title;

        title.innerText = latest[0].title;
        textResult.innerText = latest[0].content;


        data.map(doc => {
            let li = document.createElement('li');
            let span = document.createElement('span');
            li.innerText = doc.title + ' ';
            li.style.fontWeight = '900'; 
            span.innerText = doc.createDate;
            span.style.fontWeight = '500'; 

            console.log(doc.title + ' ' + doc.createDate + ' ' + doc.documentId);


            

            li.addEventListener('click', () => {
                console.log(doc.documentId);
                title.innerText = doc.title;
                textResult.innerText = doc.content;

            })

            docList.appendChild(li);
            li.appendChild(span);
        })
    })
}

printDoc();
