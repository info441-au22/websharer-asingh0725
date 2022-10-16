
async function previewUrl(){
    const url = document.getElementById("urlInput").value;
    const apiUrl = "/api/v1/urls/preview?url=" + url;
    let preview = null;

    try{
        fetch(apiUrl)
            .then(res => res.text())
            .then(value => {
                preview = value;
                displayPreviews(preview)
            })
            .catch(error => displayPreviews(error));
    } catch(error) {
        console.log("Error = ", error)
    }
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
