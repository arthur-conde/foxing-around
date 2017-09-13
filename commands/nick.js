const config = require("../config/config.json");
const util = require("../foxxo.util.js");
exports.run = (client, message, [mention, ...nick]) => {
    if (!message.member.hasPermission("MANAGE_NICKNAMES")) {
        message.delete(4000)
        return;
    }
    if (!mention) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, provide a guild member to kick`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, I don't have the permissions to do that`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    var nickMember = util.getGuildMember(mention, message)
    if (nickMember) {
        nickMember.setNickname(`${nick}`)
            .then(member => {
                if (nick = []) {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully reset the nickname for ${nickMember.user.tag} | <@${nickMember.id}> | ID: ${nickMember.id}`))
                } else {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully nicknamed ${nickMember.user.tag} | <@${nickMember.id}> | ID: ${nickMember.id} to ${nick}`))
                }
            });
        message.delete(4000);
        return;

    } else {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${mention}** is not a valid guild member`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
    }
};
