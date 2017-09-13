const util = require("../foxxo.util.js");
const config = require("../config/config.json");
exports.run = (client, message, [mention, ...reason]) => {
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
                    // enter confirmation request here
                    var pin = util.getRandInt(1000, 9999);
                    const isBot = bannedUser.bot == true ? "🤖" : "";
                    const isWhitelisted = config.whitelist.includes(`${bannedUser.id}`) == true ? "[🔑Whitelist]" : ""
                    const isBlacklisted = config.blacklist.includes(`${bannedUser.id}`) == true ? "[⛔Blacklist]" : ""
                    const isOwner = config.owner.includes(`${bannedUser.id}`) == true ? "[🦊Owner]" : ""
                    const bannedUserStatus = bannedUser.presence.status.charAt(0).toUpperCase() + bannedUser.presence.status.slice(1);
                    const bannedUserPlaying = bannedUser.presence.game == null ? "None" : bannedUser.presence.game
                    var bannedUserAccountAge = Math.floor((Date.now() - bannedUser.createdAt) / 1000 / 60 / 60 / 24);
                    message.channel.send({
                            embed: {
                                color: 243073,
                                title: `Confirmation needed - unban`,
                                description: `:question: <@${message.member.id}>, is this the user you are looking for?\r\nConfirm removal of ban with pin **${pin}**, refuse with \`cancel\`\r\n`,
                                thumbnail: {
                                    url: bannedUser.avatarURL
                                },
                                fields: [{
                                        name: `Userinformation`,
                                        value: `**Usertag:** ${isWhitelisted}${isBlacklisted}${isBot} ${bannedUser.tag}\r\n**ID:** ${bannedUser.id}\r\n**Mention:** <@${bannedUser.id}>\r\n\r\n**Status:** ${bannedUserStatus}\r\n**Playing:** ${bannedUserPlaying}`,
                                        inline: false
                                    },
                                    {
                                        name: "Accountinformation",
                                        value: `**Accountage:** ${bannedUserAccountAge} day(s)`,
                                        inline: false
                                    }
                                ],
                                footer: {
                                    text: `Request by ${message.member.displayName} (${message.author.id})`,
                                    icon_url: message.author.avatarURL
                                }
                            }
                        })
                        .then(msg => {
                            message.channel.awaitMessages(response => response.author.id === message.author.id, {
                                    max: 1,
                                    time: 30000,
                                    errors: [`time`],
                                })
                                .then(collectedMsg => {
                                    if (collectedMsg.first().content === `${pin}`) {
                                        message.guild.unban(bannedUser)
                                            .then(unbannedUser => {
                                                message.channel.send(
                                                    util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully unbanned ${unbannedUser.tag} | <@${unbannedUser.id}> | ID:${unbannedUser.id}`)
                                                );
                                            })
                                    } else {
                                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, request to unban canceled`))
                                            .then(message => {
                                                message.guild.me.lastMessage.delete(6000);
                                            });
                                    }
                                    collectedMsg.first().delete(4000)
                                    msg.delete(4000)
                                    message.delete(4000);
                                })
                                .catch(e => {
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, request to unban canceled`))
                                        .then(message => {
                                            message.guild.me.lastMessage.delete(6000);
                                        });
                                    message.delete(0);
                                    msg.delete(4000)
                                })
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
};
