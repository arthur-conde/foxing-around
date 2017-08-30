const config = require("../config.json");
const util = require("../foxxo.util.js");
exports.run = (client, message, [mention, ...reason]) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) {
        console.log(`!!! unauthorized command invoke !forceban by user <@${message.member.id}> | ${message.member.displayName} |  ${message.member.user.username}#${message.member.user.discriminator} ==> on <${mention}>`);
        message.delete(4000);
        return;
    }
    if (!mention) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, please provide a guild member to forceban`))
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
    message.guild.ban(mention, `${message.member.displayName} (ID: ${message.member.id}): ` + reason.join(" "))
        .then(forceBanMember => {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully forcebanned ${forceBanMember.username}#${forceBanMember.discriminator} | <@${forceBanMember.id}> | ID: ${forceBanMember.id}`));
        })
        .catch(error => {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}> ${error}`))
                .then(message => {
                    message.guild.me.lastMessage.delete(6000);
                });
        })
    message.delete(4000);
    return;
};
