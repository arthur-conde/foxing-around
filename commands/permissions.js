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
            description: `_ _`,
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
    message.channel.send(permissionEmbed)
        .then(message => {
            message.guild.me.lastMessage.delete(10000);
        });
    message.delete(4000);
}
