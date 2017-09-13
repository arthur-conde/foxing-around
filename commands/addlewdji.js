const config = require("../config/config.json");
const lewdjiconfig = require("../config/lewdjiconfig.json");
const util = require("../foxxo.util.js");
const fs = require("fs")
exports.run = (client, message, [link]) => {
    if (!config.whitelist.includes(`${message.author.id}`) && !config.owner.includes(`${message.author.id}`)) {
        return;
    }
    if (!link) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, provide a link to add`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (!/.jpg$|.png$|.gif$/.test(link)) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, provided link needs to end in .png/.jpg/.gif to work with discords embed system!`))
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
    fs.writeFile("./config/lewdjiconfig.json", JSON.stringify(lewdjiconfig, null, 4), (err) => console.error);
};
