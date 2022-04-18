let storage_ref = firebase.storage().ref();

let file_name = document.querySelector("#file-name");
let file_subject = document.querySelector("#file-subject");
let file_message = document.querySelector("#file-message");

let save_blob = (name, blob) => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
};

let init = () => {
    let name = new URLSearchParams(location.search).get("file");
    let ref = storage_ref.child(name);
    ref.getDownloadURL().then((url) => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
            let blob = xhr.response;
            ref.getMetadata().then((metadata) => {
                let name = metadata.customMetadata.name;
                let subject = metadata.customMetadata.subject;
                let message = metadata.customMetadata.message;
                file_name.textContent = name;
                file_subject.textContent = subject;
                file_message.textContent = message;
                // console.log(`name: ${name}, subject: ${subject}, message: ${message}`);
                save_blob(name, blob);
            }).catch((err) => {
                console.log("Failed to get file metadata!");
            });
        };
        xhr.open('GET', url);
        xhr.send();
    }, (err) => {
        console.log("File not found!");
    });
};

init();
