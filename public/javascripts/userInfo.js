async function init(){
    await loadIdentity();
    loadUserInfo();
}

async function saveUserInfo(){
    const urlParam = new URLSearchParams(window.location.search);
    const username = urlParam.get(`user`);
    const age = document.getElementById('ageInput').value;
    const personalLink = document.getElementById('linkInput').value;
    let responseJSON = await fetchJSON(`api/${apiVersion}/userInfo`, {
        method: "POST",
        body: {username: username, age: age, personal_website: personalLink}
    })
    loadUserInfo();
}

async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
        
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }
    
    const dataJSON = await fetchJSON(`api/${apiVersion}/userInfo?username=${username}`)
    if(dataJSON.error) {
        document.getElementById("user_info_div").innerHTML = `<p>${jsonData.error}</p>`;
    } else {
        const filteredData = dataJSON.filter((userInfo) => userInfo.username === username);
        const outputElement = 
            `
            <div>
                <p>User ${filteredData[filteredData.length - 1].username}'s age is 
                   ${filteredData[filteredData.length - 1].age === "" ? "Age Not Entered"
                   : filteredData[filteredData.length - 1].age}</p>
                <p>User's personal website: ${filteredData[filteredData.length - 1].personal_website === "" ? 
                   "Personal Website Not Entered" : filteredData[filteredData.length - 1].personal_website}</p>
            </div>
            `;            
        document.getElementById("user_info_div").innerHTML = outputElement;
    }
    loadUserInfoPosts(username)
}


async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/posts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}


async function deletePost(postID){
    let responseJson = await fetchJSON(`api/${apiVersion}/posts`, {
        method: "DELETE",
        body: {postID: postID}
    })
    loadUserInfo();
}