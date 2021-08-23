
var count1 = 1;
function addimage(){
    $('#imagegroup').append('<div class="col-lg-6 col-md-12" id="removeThisImageColumn'+ count1 +'">\n' +
        '                                <div class="row">\n' +
        '                                    <div class="col-10">\n' +
        '                                        <div class="form-group">\n' +
        '                                            <input type="file" class="form-control-file news-images" name="images" id="img'+ count1 +'" accept="image/x-png,image/gif,image/jpeg" onchange="showPreview(\''+ count1 +'\',this.files)"><input type="hidden" name="image" id="image'+ count1 +'">\n' +
        '                                        </div>\n' +
        '                                    </div>\n' +
        '                                    <div class="col-2">\n' +
        '                                        <a id="removeThisImage'+ count1 +'" onclick="deleteimage(\''+ count1 +'\')" style="text-decoration: none;font-size: 1.5rem;color: #DC3545;"><i class="fas fa-times-circle"></i></a>\n' +
        '                                    </div>' +
        '                                    <div class="col-12">\n' +
        '                                        <button type="button" onclick="submitImage(\''+ count1 +'\')" id="upload-image-button'+ count1 +'" class="btn btn-primary news-images-button">Upload</button>\n' +
        '                                        <br><br>\n' +
        '                                    </div>\n' +
        '                                    <div class="col-12" style="padding: 15px">\n' +
        '                                        <img src="/images/no_image.jpeg" alt="" id="image-preview'+ count1 +'" style="width: 100%">\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                            </div>');
    count1++;
}

function deleteimage(i){
    if(i == '0'){
        document.getElementById('img0').value = '';
        var $source = $('#image-preview0');
        $source[0].src = '';
        document.getElementById('forFirstImage').style.display = 'none';
    } else {
        var a = '#removeThisImageColumn' + i;
        $(a).remove();
    }
}

function showPreview(id,files){
    if(files) {
        if(id == '0'){
            document.getElementById('forFirstImage').style.display = 'block';
        }
        var reader = new FileReader();

        reader.onload = function(event) {
            $('#image-preview'+ id).attr('src',event.target.result);
        }
        reader.readAsDataURL(files[0]);
    }
}

function submitImage(id) {
    var file = document.getElementById('img' + id).files[0];

    if(file != undefined){
        var form = new FormData();
        form.append('images', file);
        document.getElementById('verify').setAttribute('disabled',true);
        document.getElementById('overlay1').style.display = 'flex';
        $.ajax({
            url : "/upload-image",
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data : form,
            success: function(response){
                console.log(response);
                if(response.message == 'success'){
                    alert('Image Uploaded Successfully');
                    var url = 'https://drive.google.com/thumbnail?id='+ response.response_id;
                    document.getElementById('image' + id).value = url;
                    document.getElementById('upload-image-button' + id).classList.remove('btn-primary');
                    document.getElementById('upload-image-button' + id).classList.add('btn-success');
                    document.getElementById('upload-image-button' + id).innerHTML = 'Uploaded';
                    document.getElementById('upload-image-button' + id).setAttribute('disabled',true);
                    if(id == '0'){
                        document.getElementById('forFirstImage').style.display = 'none';
                    } else {
                        document.getElementById('removeThisImage' + id).style.display = 'none';
                    }
                } else {
                    alert('Some error occured');
                }
                document.getElementById('overlay1').style.display = 'none';
                document.getElementById('verify').removeAttribute('disabled');
            },
            error: function(err){
                console.log(err.status);
            }
        });
    } else {
        alert('Please Select a file first!');
    }
}

var subcatlength = document.getElementById('subcatlength').value;
$('#c').change(function(){
    var a = parseInt(this.value);
    var select = document.getElementById("sc");
    var length = select.options.length;
    for (var i = length-1; i >= 0; i--) {
        select.options[i] = null;
    }
    var b = 0;
    for(var i = 0;i<subcatlength;i++){
        var subcategoriesName = document.getElementById('subcategoriesName'+i).value;
        var subcategoriesId = document.getElementById('subcategoriesId'+i).value;
        var subcategoriesCat = parseInt(document.getElementById('subcategoriesCat'+i).value);
        if(subcategoriesCat == a){
            var option = document.createElement("option");
            option.text = subcategoriesName;
            option.value= subcategoriesId;
            select.add(option);
            b++;
        }
    }
    if(b==0){
        var option = document.createElement("option");
        option.text = "No subcategory present";
        option.value= '0';
        select.add(option);
    } else {
        var option = document.createElement("option");
        option.text = "Other";
        option.value= '0';
        select.add(option);
    }
});

function showVideoPreview(id,a) {
    if(id == '0'){
        document.getElementById('forFirstVideo').style.display = 'block';
    }
    var $source = $('#video_here' + id);
    $source[0].src = URL.createObjectURL(a[0]);
    $source.parent()[0].load();
}

var count = 1;
function addMoreVideo() {
    $('#addMoreVideos').append('<div class="row" id="removethisvideo'+ count +'" style="margin: 0;width: 100%;padding: 0"><div class="col-lg-6 col-12" style="padding: 0">\n' +
        '                                <div class="form-group">\n' +
        '                                    <input type="file" class="form-control-file news-videos" name="videos" id="youtube-videos'+ count +'" accept="video/*" onchange="showVideoPreview(\''+ count +'\',this.files)"><input type="hidden" name="url" id="url'+ count +'">\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                            <div class="col-lg-4 col-6" style="padding: 0;">\n' +
        '                                <button type="button" onclick="submitvideo(\''+ count +'\')" id="upload-button'+ count +'" class="btn btn-primary news-videos-button">Upload</button>\n' +
        '                                <br><br>\n' +
        '                            </div>\n' +
        '                            <div class="col-lg-2 col-6" style="padding: 0;text-align: right">\n' +
        '                                <a id="removeVideoButton'+ count +'" onclick="removeVideo('+ count +')" style="text-decoration: none;font-size: 1.5rem;color: #DC3545"><i class="fas fa-times-circle"></i></a>\n' +
        '                            </div>\n' +
        '                            <div class="col-12" style="padding: 15px;padding: 0">\n' +
        '                                <video width="100%" controls>\n' +
        '                                    <source src="mov_bbb.mp4" id="video_here'+ count +'">\n' +
        '                                    Your browser does not support HTML5 video.\n' +
        '                                </video>\n' +
        '                            </div></div>')
    count++;
}

function removeVideo(id){
    if(id == '0'){
        document.getElementById('youtube-videos0').value = '';
        var $source = $('#video_here' + id);
        $source[0].src = 'mov_bbb.mp4';
        $source.parent()[0].load();
        document.getElementById('forFirstVideo').style.display = 'none';
    } else {
        $('#removethisvideo' + id).remove();
    }
}

function submitvideo(id) {
    var file = document.getElementById('youtube-videos' + id).files[0];
    // console.log(file);
    if(file != undefined){
        var form = new FormData();
        form.append('videos', file);
        form.append('title', $('#title').val());
        form.append('description', $('#sd').val());
        // console.log(form);
        if($('#title').val() != "" && $('#sd').val() != ""){
            document.getElementById('verify').setAttribute('disabled',true);
            document.getElementById('overlay1').style.display = 'flex';
            $.ajax({
                url : "/upload-video",
                type: "POST",
                cache: false,
                contentType: false,
                processData: false,
                data : form,
                success: function(response){
                    // console.log(response);
                    if(response.message == 'success'){
                        alert('Video Uploaded Successfully');
                        var url = 'https://www.youtube.com/watch?v=' + response.response_id ;
                        document.getElementById('url' + id).value = url;
                        document.getElementById('upload-button' + id).classList.remove('btn-primary');
                        document.getElementById('upload-button' + id).classList.add('btn-success');
                        document.getElementById('upload-button' + id).innerHTML = 'Uploaded';
                        document.getElementById('upload-button' + id).setAttribute('disabled',true);
                        if(id == '0'){
                            document.getElementById('forFirstVideo').style.display = 'none';
                        } else {
                            document.getElementById('removeVideoButton' + id).style.display = 'none';
                        }
                    } else {
                        alert('Some error occured');
                    }
                    document.getElementById('overlay1').style.display = 'none';
                    document.getElementById('verify').removeAttribute('disabled');
                },
                error: function(err){
                    console.log(err.status);
                }
            });
        } else {
            alert('Please fill the title and short description first to upload the video!');
        }
    } else {
        alert('Please Select a file first!');
    }
}

function createNews(){

    // var news_videos = $('.news-videos-button');
    // var news_images = $('.news-images-button');
    // console.log(news_videos[0].innerHTML);
    // console.log(news_images);
    //
    // var nv1 = 0;
    // var nv2 = 0;

    // for(var i = 0;i<news_videos.length;i++){
    //     if(news_videos[i].files[0] == undefined){
    //         nv1++;
    //     }
    // }
    //
    // for(var i = 0;i<news_images.length;i++){
    //     if(news_images[i].files[0] == undefined){
    //         nv2++;
    //     }
    // }
    //
    // if(nv1 > 0){
    //     alert('first Upload all the videos')
    // }

    // alert('hello');
    var category_id = document.getElementById('c').value;
    var sub_category_id = document.getElementById('sc').value;
    var title = document.getElementById('title').value;
    var short_description = document.getElementById('sd').value;
    var admin_id = document.getElementById('admin_id').value;
    var description = ($('.cke_wysiwyg_frame')[0]).contentWindow.document.body.innerHTML;
    var videos = [];
    var images = [];



    var url = $('input[name="url"]');
    var image = $('input[name="image"]');
    for(var i=0;i<url.length;i++){
        if(url[i].value != ''){
            videos.push(url[i].value);
        }
    }
    for(var i=0;i<image.length;i++){
        if(image[i].value != ''){
            images.push(image[i].value);
        }
    }
    document.getElementById('verify').setAttribute('disabled',true);
    document.getElementById('overlay1').style.display = 'flex';
    // console.log(videos);
    // console.log(images);
    var data = {
        category_id : category_id,
        sub_category_id :sub_category_id,
        title: title,
        short_description: short_description,
        description: description,
        videos:JSON.stringify(videos),
        images:JSON.stringify(images),
        admin_id:admin_id
    }

    $.ajax({
        url : "/add-news",
        type: "POST",
        data : data,
        success: function(response){
            // $('.result').html(response.html)
            // console.log(response);
            if(response.message == 'success'){
                alert('News submitted successfully!!');
                location.reload();
            } else {
                alert('Something went wrong!!');
            }
            document.getElementById('overlay1').style.display = 'none';
            document.getElementById('verify').removeAttribute('disabled');
        },
        error: function(err){
            console.log(err.status);
        }
    });
    return false;
}