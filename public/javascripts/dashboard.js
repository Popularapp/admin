$(function(){
    if($('textarea#ta').length){
        CKEDITOR.replace('ta', {
            filebrowserUploadUrl: '/upload',
            filebrowserUploadMethod: 'form'
        });
    }
});


