const dateFormat = require('dateformat');
const createMessage = (message, username) => {
    return {
        message,
        username,
        createTime: dateFormat(new Date(), "dd/mm/yy - HH:MM:ss")
    }
}

module.exports = createMessage;