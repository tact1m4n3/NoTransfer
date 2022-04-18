const UID_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_-$"
const UID_LENGTH = 20;

let scroll_btn = document.querySelector("#scroll-btn");
let upload_error = document.querySelector("#upload-error");
let upload_subject = document.querySelector("#upload-subject");
let upload_message = document.querySelector("#upload-message");
let upload_file = document.querySelector("#upload-file");
let upload_btn = document.querySelector("#upload-btn");
let upload_results = document.querySelector("#upload-results");
let upload_progress = document.querySelector("#upload-progress-bar");
let file_fake_url = document.querySelector("#file-fake-url");
let file_real_url = document.querySelector("#file-real-url");
let statistic_count = document.querySelector("#statistic-count");
let statistic_probability = document.querySelector("#statistic-probability");

let storage_ref = firebase.storage().ref();

/* generate a unique id for the file */
let generate_uid = () => {
    let id = "";
    for (let i = 0; i < UID_LENGTH; i++) {
        let idx = Math.floor(Math.random() * UID_CHARS.length);
        id += UID_CHARS[idx];
    }
    return id;
};

scroll_btn.addEventListener("click", () => {
    window.scrollTo(0, window.innerHeight);
});

upload_btn.addEventListener("click", (event) => {
    let file_list = upload_file.files;
    if (file_list.length == 0) {
        // console.log("No file selected!");
        upload_error.style.display = "block";
        setTimeout(() => {
            upload_error.style.display = "none";
        }, 5000);
        return;
    }

    let file = file_list[0];
    let ref = storage_ref.child(generate_uid());

    let metadata = {
        customMetadata: {
            'name': file.name,
            'subject': upload_subject.value,
            'message': upload_message.value
        }
    };

    upload_results.style.display = "block";

    let task = ref.put(file, metadata);
    task.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        upload_progress.style.width = `${progress}%`
    }, (error) => {
        switch (error.code) {
            case "storage/unauthorized":
                console.log("Don't have permission to upload!");
                break;
            case "storage/canceled":
                console.log("Upload canceled!");
                break;
            case "storage/unknown":
                console.log("Unknown error occurred!");
                break;
        }
    }, () => {
        console.log("File uploaded!");

        storage_ref.listAll().then((res) => {
            let items = res.items;
            let idx = Math.floor(Math.random() * items.length);
            if (window.location.host) {
                file_fake_url.textContent = `${window.location.origin}/download.html?file=${items[idx].name}`;
                file_real_url.textContent = `${window.location.origin}/download.html?file=${ref.name}`;
            } else {
                let href = window.location.href;
                file_fake_url.textContent = `${href.slice(0, href.search("index.html"))}download.html?file=${items[idx].name}`;
                file_real_url.textContent = `${href.slice(0, href.search("index.html"))}download.html?file=${ref.name}`;
            }
        }).catch((err) => {
            console.log("Error while listing files");
        });
    });

    upload_subject.value = "";
    upload_message.value = "";
    upload_file.value = "";
});

setInterval(() => {
    storage_ref.listAll().then((res) => {
        let items = res.items;
        statistic_count.textContent = `${items.length}`;
        if (items.length != 0) {
            statistic_probability.textContent = `${Math.floor(100 / items.length)}%`;
        } else {
            statistic_probability.textContent = "not yet known"
        }
    }).catch((err) => {
        console.log("Error while listing files");
    });
}, 2000);

console.log("Hello from js!");
