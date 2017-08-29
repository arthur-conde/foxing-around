exports.run = (client, message, [mention, ...reason]) => {
    const config = require("../config.json");
    if (!mention) {
        message.channel.send({
            embed: {
                color: message.guild.me.displayColor,
                description: `:x: <@${message.member.id}>, please provide a guild member to unban`
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
                description: `:x: Sorry <@${message.member.id}>, I don't have the permissions to do that`
            }
        }).then(message => {
            message.guild.me.lastMessage.delete(6000);
        });
        message.delete(4000);
        return
    }
    if (!message.member.hasPermission("BAN_MEMBERS")) {
        console.log(`[!!!] unauthorized command invoke !unban by user <@${message.member.id}>,${message.member.displayName}, ${message.member.user.username}#${message.member.user.discriminator} || on <${mention}>`);
        message.delete(4000);
        return
    }
    message.guild.fetchBans()
        .then(
            banCollection => {
                var bannedUser = banCollection.find(user => {
                    if (user.id == `${mention}` || `${user.username}#${user.discriminator}` == `${mention}`) {
                        return user;
                    }
                })
                if (bannedUser) {
                    message.guild.unban(bannedUser)
                        .then(unbannedUser => {
                            message.channel.send({
                                embed: {
                                    color: message.guild.me.displayColor,
                                    description: `:white_check_mark: Okay <@${message.member.id}>, ${unbannedUser.username}#${unbannedUser.discriminator} <@${unbannedUser.id}> (ID:${unbannedUser.id}) was succesfully unbanned.`
                                }
                            })
                        })
                } else {
                    message.channel.send({
                            embed: {
                                color: message.guild.me.displayColor,
                                description: `:x: Sorry <@${message.member.id}>, **${mention}** is not a banned user`
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
