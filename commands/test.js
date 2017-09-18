const config = require("../config/config.json");
const util = require("../foxxo.util.js");
const fs = require("fs")

exports.run = (client, message, args) => {
    console.log("++++++++++++++++++++++++++++++++++++++++")
    if (/.jpg$|.png$/.test(args[0])) {
        message.channel.send("that's an image!")
        return;
    }
    message.channel.send("not an image ._.")
    message.delete()
};
