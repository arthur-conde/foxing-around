const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, args) => {
    var argument = args.shift()
    var permissions = new Discord.Permissions(parseInt(argument)).serialize();
    var buffer = [];
    for (var p in permissions) {
        buffer.push(`${p}: ${permissions[p] ? "✅": "❌"}`);
    }
    var permissionEmbed = {
        embed: {
            title: `Permission parse for "${argument}"`,
            color: message.guild.me.displayColor,
            description: `Window visible for 30 seconds, to close window type **exit**`,
            fields: [],
            footer: {
                text: `Request by ${message.member.displayName} (${message.author.id})`,
                icon_url: message.author.avatarURL
            }
        }
    }
    for (var i in permissions) {
        permissionEmbed.embed.fields.push({
            name: `${i.toLowerCase()}`,
            value: `${permissions[i] ? "✅": "❌" }`,
            inline: true
        })
    }
    message.delete()
    message.channel.send(permissionEmbed)
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
