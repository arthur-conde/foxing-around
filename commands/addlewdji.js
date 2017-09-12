const config = require("../config.json");
const lewdjiconfig = require("../lewdjiconfig.json");
const util = require("../foxxo.util.js");
const fs = require("fs")
exports.run = (client, message, [link]) => {
    if (message.author.id !== config.ownerID && message.author.id !== config.teachID && message.author.id !== "108241729034952704") return;
    if (!link) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, provide a link to add`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (lewdjiconfig.lewds.includes(link)) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, lewdji has already been added`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    lewdjiconfig.lewds.push(link);
    message.channel.send({
        embed: {
            color: message.guild.me.displayColor,
            description: `:eyes: <@${message.member.id}> added a lewdji`,
            thumbnail: {
                url: link
            },
        }
    })
    message.delete(4000);
    fs.writeFile("./lewdjiconfig.json", JSON.stringify(lewdjiconfig, null, 4), (err) => console.error);
};
