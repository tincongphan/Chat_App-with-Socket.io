let userList = [
]
const findUser = (id) => userList.find(user => user.id === id)

const addUser = (user) => userList = [...userList, user];

const getUserList = (room) => userList.filter(user => user.room === room);

const removeUser = (id) => userList = userList.filter(user => user.id !== id)

module.exports = {
    getUserList,
    addUser,
    removeUser,
    findUser
};