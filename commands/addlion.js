const config = require("../config.json");
const lionconfig = require("../ranlionconfig.json");
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
    if (lionconfig.lions.includes(link)) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, lion has already been added`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    lionconfig.lions.push(link);
    message.channel.send({
        embed: {
            color: message.guild.me.displayColor,
            description: `:lion: <@${message.member.id}> added a lion`,
            thumbnail: {
                url: link
            },
        }
    })
    message.delete(4000);
    fs.writeFile("./ranlionconfig.json", JSON.stringify(lionconfig, null, 4), (err) => console.error);
};
