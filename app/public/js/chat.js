
var socket = io()  // io() is a event connect to server

document.getElementById("chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.getElementById("chatInput").value;
    const acknownledgement = (error) => {
        if (error) {
            return alert("Text includes bad-words")
        }
    }
    socket.emit("client send message", message, acknownledgement)
})

//  show message
socket.on("server send message", (messageServer) => {
    const { message, createTime, username } = messageServer;
    const htmlMessage = document.getElementById("txt_message").innerHTML;
    const messageElement = `
    <div class="message_item">
    <div class="message_row1 mt-2">
        <div class="message_name mx-4">${username}</div>
        <div class="message_date">${createTime}</div>
    </div>
    <div class="message_row2">
        <p class="message_content mx-4">${message}</p>
    </div>
    </div>
    `;
    const showMessage = htmlMessage + messageElement
    document.getElementById("txt_message").innerHTML = showMessage
    document.getElementById("chatInput").value = ""
})

// user send location
document.getElementById("btnLocation").addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("browser not support to get position")
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("share location", { latitude, longitude })
    })
})

//  showlocation
socket.on("server send location", (messageServer) => {
    const { message, createTime, username } = messageServer;
    const htmlMessage = document.getElementById("txt_message").innerHTML;
    const messageElement = `
    <div class="message_item">
    <div class="message_row1">
        <div class="message_name mx-4">${username}</div>
        <div class="message_date ">${createTime}</div>
    </div>
    <div class="message_row2 ">
     <a  target="_blank" href=${message} class="mx-4 message_content" >Click to visit my location!</a>
    </div>
    </div>
    `;
    const showMessage = htmlMessage + messageElement
    document.getElementById("txt_message").innerHTML = showMessage
    document.getElementById("chatInput").value = ""
})
// querystring
const queryString = location.search;
const { username, room } = Qs.parse(queryString, {
    ignoreQueryPrefix: true
})
document.getElementById("nameroom").innerHTML = `${room}`
socket.emit("join", { username, room })

// userlist
socket.on("userList", (userList) => {
    let userlistapp = "";
    userList.map((user) => {
        userlistapp += `
        <li> ${user.username} </li>
        `
    })
    document.getElementById("list_user_app").innerHTML = userlistapp;
})