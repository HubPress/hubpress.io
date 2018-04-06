<?php
/*  
    Yopp is a very fast way to transfer a file from phone to computer and vice versa.

    author:   Joseph Ernest (twitter: @JosephErnest)
    url:      https://github.com/josephernest/yopp
    license:  MIT license
*/

$maxsize = 50*1024*1024;       // 50 MB
$thefiledata = 'thefiledata';  // file which contains the data
$thefilename = 'thefilename';  // file which contains only the filename
$autoeraseafterdownload = 1;   // delete file after a download

if (isset($_POST['type']) && $_POST['type'] == 'upload')
{  
    if (empty($_FILES['data']['tmp_name'])) { echo 'ERROR'; die(); }          // no file sent
    if (!empty($_POST['email'])) { echo 'ERROR'; die(); }                     // spam honeypot
    if ($_POST['fname'] !== $_FILES['data']['name']) { echo 'ERROR'; die(); } // someone wants to cheat?
    if ($_FILES['data']['size'] > $maxsize) { echo 'TOO BIG!'; die(); }       // too big file

    $localfname = $_POST['fname'];

    $data = file_get_contents($_FILES['data']['tmp_name']);

    $file = fopen($thefiledata, 'w');
    fwrite($file, $data);
    fclose($file);

    $filename = fopen($thefilename, 'w');
    fwrite($filename, $localfname);
    fclose($filename);
    
    echo 'DONE'; die();
}

if (isset($_GET['type']) && $_GET['type'] == 'download')
{
    if (!file_exists($thefiledata) || !file_exists($thefilename))
    {
        echo '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body><a href="index.php">NO FILE UPLOADED YET, RELOAD PAGE</a></body></html>';
        exit;
    }
    $fname = file_get_contents($thefilename);
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $fname . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($thefiledata));
    readfile($thefiledata);

    if ($autoeraseafterdownload) 
    {
        unlink($thefiledata);
        unlink($thefilename);
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset=utf-8>
<meta name="viewport" content="width=device-width, initial-scale=0.41, maximum-scale=1" />
<title>Yopp</title>
<style type="text/css">
* { color: white; font-family: sans-serif;  padding: 0; margin: 0; cursor: pointer; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
#upload { width: 100%; top: 0; position: absolute; background-color: #f44242; height: 50%; }
#download { width: 100%; top: 50%; position: absolute; background-color: #42a1f4; height: 50%; left: 0; }
.text { position: absolute; top: 40%; text-align: center; width: 100%; font-size: 3em; }
#email_addr { display:none; }
</style>
</head>
<body>
<input type='file' id='file' />  
<div id="upload"><div class="text" id="uploadtext">UPLOAD</div></div>
<a href="index.php?type=download" id="download"><div class="text">DOWNLOAD</div></a>
<input id="email_addr" type="text" name="email" size="25" value="" autocomplete="off" />
<script>
var upload = document.getElementById('upload');
var uploadtext = document.getElementById('uploadtext');
var fileelt = document.getElementById('file');

upload.onclick = function() { fileelt.click(); };

function readfiles(files) {
    if (files[0].size > <?php echo $maxsize; ?>) { uploadtext.innerHTML = 'TOO BIG!'; return; }
    var formData = new FormData();
    formData.append('type', 'upload');
    formData.append('fname', files[0].name);
    formData.append('data', files[0]);
    formData.append('email', document.getElementById('email_addr').value);
    uploadtext.innerHTML = 'BEGINNING UPLOAD';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '.');
    xhr.onload = function() { uploadtext.innerHTML =  xhr.responseText; };
    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            var complete = (event.loaded / event.total * 100 | 0);
            var complete36 = (event.loaded / event.total * 36 | 0);
            uploadtext.innerHTML = 'UPLOADING<br>PROGRESS '+ complete + '%';
        }
    };
    xhr.send(formData);
}

document.body.ondragover = function() { uploadtext.innerHTML = 'DROP YOUR FILE HERE'; return false; };

document.body.ondrop = function(e) { e.preventDefault();  readfiles(e.dataTransfer.files); };

fileelt.addEventListener("change", function(e) { readfiles(fileelt.files); })
</script>
</body>
</html>
