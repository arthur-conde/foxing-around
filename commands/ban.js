exports.run = (client, message, [mention, ...reason]) => {
    
    const config = require("../config.json");
    var util = null;
    try {
        util = require("../foxxo.util.js");
        console.log(util);
    }
    catch(err) {
        console.error(err);
    }

    if (!mention) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, please provide a guild member to ban`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: Sorry <@${message.member.id}>, I don't have the permissions to do that`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (!message.member.hasPermission("BAN_MEMBERS")) {
        console.log(`[!!!] unauthorized command invoke !ban by user <@${message.member.id}>,${message.member.displayName}, ${message.member.user.username}#${message.member.user.discriminator} || on <${mention}>`);
        message.delete(4000);
        return;
    }
    if (message.mentions.users.size === 1) {
        const banMember = message.mentions.members.first();
        banMember.ban(reason.join(" "))
            .then(member => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}>, ${banMember.displayName} | <@${banMember.id}> | (ID: ${banMember.id}) was succesfully banned.`))
            });
        message.delete(4000);
        return;
    }
    if (message.guild.members.get(`${mention}`) !== undefined) {
        const banMember = message.guild.members.get(`${mention}`);
        banMember.ban(reason.join(" "))
            .then(member => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}>, ${banMember.displayName} | <@${banMember.id}> | (ID: ${banMember.id}) was succesfully banned.`))
            });
        message.delete(4000);
        return;
    }
    var nickUserName = message.guild.members.find(function(member) {
        if (member.nickname != null) {
            if (member.nickname.toUpperCase() == mention.toUpperCase())
                return true;
        }
        if (member.user.username.toUpperCase() == mention.toUpperCase())
            return true;
    });

    if (nickUserName != null) {
        nickUserName.ban(reason.join(" "))
            .then(member => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}>, ${nickUserName.displayName} | <@${nickUserName.id}> | (ID: ${nickUserName.id}) was succesfully banned.`));
            });
        message.delete(4000);
        return;
    } else {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: Sorry <@${message.member.id}>, **${mention}** is not a valid guild member`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
    }
};
