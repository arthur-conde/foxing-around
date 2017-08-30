const util = require("../foxxo.util.js");
exports.run = (client, message, [mention, ...reason]) => {
    const config = require("../config.json");
    if (!mention) {
        message.channel.send({
            embed: {
                color: message.guild.me.displayColor,
                description: `:x: <@${message.member.id}>, provide a guild member to unban`
            }
        }).then(message => {
            message.guild.me.lastMessage.delete(6000);
        });
        message.delete(4000);
        return;
    }
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
        message.channel.send({
            embed: {
                color: message.guild.me.displayColor,
                description: `:x: <@${message.member.id}>, I don't have the permissions to do that`
            }
        }).then(message => {
            message.guild.me.lastMessage.delete(6000);
        });
        message.delete(4000);
        return
    }
    if (!message.member.hasPermission("BAN_MEMBERS")) {
        console.log(`[!!!] unauthorized command invoke !unban by user <@${message.member.id}>,${message.member.displayName}, ${message.member.user.tag} || on <${mention}>`);
        message.delete(4000);
        return
    }
    message.guild.fetchBans()
        .then(
            banCollection => {
                var bannedUser = banCollection.find(user => {
                    if (user.id == `${mention}` || `${user.tag}` == `${mention}`) {
                        return user;
                    }
                })
                if (bannedUser) {
                    message.guild.unban(bannedUser)
                        .then(unbannedUser => {
                            message.channel.send(
                                util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully unbanned ${unbannedUser.tag} | <@${unbannedUser.id}> | ID:${unbannedUser.id}`)
                            );
                        })
                } else {
                    message.channel.send({
                            embed: {
                                color: message.guild.me.displayColor,
                                description: `:x: <@${message.member.id}>, **${mention}** is not a banned user`
                            }
                        })
                        .then(message => {
                            message.guild.me.lastMessage.delete(6000);
                        });
                }
            })
        .catch(
            console.error
        )
    message.delete(4000);
};
