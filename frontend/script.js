tinymce.init({
    selector: '#textContent',
    plugins: 'code',
    toolbar: 'undo redo | | forecolor backcolor | styleselect bold italic | alignleft alignright | code',
    setup: function(editor) {
        editor.on('change', function(){
            editor.save();
        })
    }
})

document.getElementById('saveBtn').addEventListener('click', function() {
    console.log(document.getElementById('textContent').value);
    document.getElementById('textResult').innerHTML = document.getElementById('textContent').value;
})