const util = require("../foxxo.util.js");
const Discord = require("discord.js");
const config = require("../config/config.json");
exports.run = (client, message, args) => {
    var argument = args.shift()
    var permissions = new Discord.Permissions(parseInt(argument)).serialize();
    var buffer = [];
    for (var p in permissions) {
        buffer.push(`${permissions[p] ? "✅": "❌"} ${p.toLowerCase()}`);
    }
    message.delete()
    message.channel.send({
            embed: {
                title: `Permission parse for "${argument}"`,
                color: message.guild.me.displayColor,
                description: `Window visible for 30 seconds, to close window type **exit**`,
                fields: [{
                    name: `_ _`,
                    value: `${buffer.join("\r\n")}`
                }],
                footer: {
                    text: `Request by ${message.member.displayName} (${message.author.id})`,
                    icon_url: message.author.avatarURL
                }
            }
        })
        .then(msg => {
            message.channel.awaitMessages(response => response.author.id === message.author.id && response.content.toUpperCase() == "EXIT", {
                    max: 1,
                    time: 30000,
                    errors: [`time`],
                })
                .then(collectedMsg => {
                    collectedMsg.first().delete()
                    msg.delete()
                })
                .catch(e => {
                    msg.delete()
                })
        })
}
