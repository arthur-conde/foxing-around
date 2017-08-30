const config = require("../config.json");
const util = require("../foxxo.util.js");
exports.run = (client, message, [mention, ...reason]) => {
    function kickGuildMember(kickMember) {
        kickMember.kick(`${message.member.displayName} (ID: ${message.member.id}) ` + reason.join(" "))
            .then(member => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully kicked ${kickMember.displayName} | <@${kickMember.id}> | ID: ${kickMember.id}`))
            });
        message.delete(4000);
        return;
    }
    if (!message.member.hasPermission("KICK_MEMBERS")) {
        console.log(`[!!!] unauthorized command invoke !kick by user <@${message.member.id}>,${message.member.displayName}, ${message.member.user.tag} || on <${mention}>`);
        message.delete(4000);
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
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, I don't have the permissions to do that`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (message.mentions.users.size === 1) {
        kickGuildMember(message.mentions.members.first())
    }
    if (message.guild.members.get(`${mention}`) !== undefined) {
        kickGuildMember(message.guild.members.get(`${mention}`));
    }
    var nickUserName = message.guild.members.find(function(member) {
        if (member.nickname != null) {
            if (member.nickname.toUpperCase() == mention.toUpperCase())
                return true;
        }
        if (`${member.user.tag}` == mention || member.user.username.toUpperCase() == mention.toUpperCase())
            return true;
    });
    if (nickUserName != null) {
        kickGuildMember(nickUserName);
    } else {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${mention}** is not a valid guild member`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
    }
};
