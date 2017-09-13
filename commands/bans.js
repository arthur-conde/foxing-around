const config = require("../config.json");
const util = require("../foxxo.util.js");
exports.run = (client, message, [args]) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) {
        message.delete(4000);
        return;
    }
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, I don't have the permissions to do that`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    message.guild.fetchBans().then(users => {
        var bannedUsers = []
        users.forEach(user => {
            bannedUsers.push(`${user.presence.status} | ${user.bot == true ? "🤖" : ""}${user.tag} (${user.id})`)
        })
        message.channel.send({
            embed: {
                title: `${message.guild.name} - Bans`,
                color: message.guild.me.displayColor,
                description: `${bannedUsers.join("\r\n")}`,
                footer: {
                    text: `Request by ${message.member.displayName} (${message.author.id})`,
                    icon_url: message.author.avatarURL
                }
            }
        })
        message.delete(4000);
    })
};
