const config = require("../config.json");
const util = require("../foxxo.util.js");
const fs = require("fs")
exports.run = (client, message, [prefix]) => {
    if (!config.owner.includes(`${message.author.id}`)) {
        return;
    }
    if (!prefix) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, provide a prefix to change to`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    config.prefix = prefix;
    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully changed prefix to ${prefix}`))
    message.delete(4000);
    fs.writeFile("./config.json", JSON.stringify(config, null, 4), (err) => console.error);
};
