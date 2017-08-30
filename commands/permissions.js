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
            author: {
                name: `Permission parse for "${argument}" as requested by ${message.member.displayName}:`,
                icon_url: message.author.avatarURL
            },
            color: message.guild.me.displayColor,
            description: `_ _`,
            fields: []
        }
    }
    for (var i in permissions) {
        permissionEmbed.embed.fields.push({
            name: `${i.toLowerCase()}`,
            value: `${permissions[i] ? "✅": "❌" }`,
            inline: true
        })
    }
    message.channel.send(permissionEmbed);
    message.delete(4000);
}
