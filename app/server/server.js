
const express = require('express');
const app = express()
const createMessage = require("./utils/generate");
const Filter = require('bad-words');
const { getUserList, addUser, removeUser, findUser } = require('./utils/users');

// 1. Settup path from folder server to folder public
const path = require('path');
const pathPublic = path.join(__dirname + "/../public")
app.use(express.static(pathPublic))

// 2. settup http
const http = require('http');
const server = http.createServer(app)

// 3. settup socket.io
const socketio = require('socket.io');
const io = socketio(server)

// 4. client connect server
io.on("connection", (socket) => {

    // join room
    socket.on("join", ({ username, room }) => {

        // allow client join room
        socket.join(room)

        //  chat
        socket.emit("server send message", createMessage(`Welcome ${username} joined chat app`, "Admin"))
        socket.on("client send message", (message, callback) => {
            const fillter = new Filter()
            if (fillter.isProfane(message)) {
                return callback("message include bad-words")
            }
            const user = findUser(socket.id);
            io.to(room).emit("server send message", createMessage(message, user.username))
            callback()
        })

        socket.broadcast.to(room).emit("server send message", createMessage(`${username} recently joined room`, "Admin"))

        //  share location
        socket.on("share location", ({ latitude, longitude }) => {
            const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`
            const user = findUser(socket.id);

            io.to(room).emit("server send location", createMessage(linkLocation, user.username))
        })

        // add user
        const user = {
            id: socket.id,
            username,
            room,
        }
        addUser(user)

        // get userList
        io.to(room).emit("userList", getUserList(room))

        // client disconnect server
        socket.on("disconnect", () => {
            removeUser(socket.id)
            io.to(room).emit("userList", getUserList(room))
        })
    })

})


const port = process.env.PORT || 9999;
server.listen(port, () => {
    console.log(`App is running on port ${port}`);
})