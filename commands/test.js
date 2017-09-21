const config = require("../config/config.json");
const util = require("../foxxo.util.js");
const fs = require("fs")

exports.run = (client, message, args) => {
    message.guild.createRole({
            "name": args[0],
            "color": args[1],
            "permissions": args[2]
        })
        .then(r => {
            message.channel.send("created.")
        })
        .catch(e => {
            message.channel.send(`\`${e}\``)
        })
};
