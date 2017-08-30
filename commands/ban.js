const config = require("../config.json");
const util = require("../foxxo.util.js");
exports.run = (client, message, [mention, ...reason]) => {
    function banGuildMember(banMember) {
        banMember.ban(`${message.member.displayName} (ID: ${message.member.id}) ` + reason.join(" "))
            .then(member => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully banned ${banMember.displayName} | <@${banMember.id}> | ID: ${banMember.id}`))
            });
        message.delete(4000);
        return;
    }
    if (!message.member.hasPermission("BAN_MEMBERS")) {
        console.log(`!!! unauthorized command invoke !ban by user <@${message.member.id}> | ${message.member.displayName} |  ${message.member.user.tag} ==> on <${mention}>`);
        message.delete(4000);
        return;
    }
    if (!mention) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, provide a guild member to ban`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
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
    if (message.mentions.users.size === 1) {
        banGuildMember(message.mentions.members.first())
    }
    if (message.guild.members.get(`${mention}`) !== undefined) {
        banGuildMember(message.guild.members.get(`${mention}`));
    }
    var nickUserName = message.guild.members.find(function(member) {
        if (member.nickname != null) {
            if (member.nickname.toUpperCase() == mention.toUpperCase())
                return true;
        }
        if (`${member.user.username}#${member.user.discriminator}` == mention || member.user.username.toUpperCase() == mention.toUpperCase())
            return true;
    });

    if (nickUserName != null) {
        banGuildMember(nickUserName);
    } else {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${mention}** is not a valid guild member`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
    }
};
