const config = require("../config.json");
const foxconfig = require("../ranfoxconfig.json");
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
    if (foxconfig.foxes.includes(link)) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, fox has already been added`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    foxconfig.foxes.push(link);
    message.channel.send({
        embed: {
            color: message.guild.me.displayColor,
            description: `:fox: <@${message.member.id}> added a fox`,
            thumbnail: {
                url: link
            },
        }
    })
    message.delete(4000);
    fs.writeFile("./ranfoxconfig.json", JSON.stringify(foxconfig, null, 4), (err) => console.error);
};
