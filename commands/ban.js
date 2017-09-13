const config = require("../config/config.json");
const util = require("../foxxo.util.js");
exports.run = (client, message, [mention, ...reason]) => {
    function banGuildMember(banMember) {
        banMember.ban(`${message.member.displayName} (ID: ${message.member.id}) ` + reason.join(" "))
            .then(member => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully banned ${banMember.displayName} | <@${banMember.id}> | ID: ${banMember.id} with reason: "${reason.join(" ")}"`))
            });
    }

    function pinBan(banMember) {
        var pin = util.getRandInt(1000, 9999);
        // finding out stuff to later display in the embed
        // check if bot
        const isBot = banMember.user.bot == true ? "🤖" : "";
        const isWhitelisted = config.whitelist.includes(`${banMember.id}`) == true ? "[🔑Whitelist]" : ""
        const isBlacklisted = config.blacklist.includes(`${banMember.id}`) == true ? "[⛔Blacklist]" : ""
        const isOwner = config.owner.includes(`${banMember.id}`) == true ? "[🦊Owner]" : ""
        // check if Nickname is present, if not display "None" since value in field is required
        const banMemberNickname = banMember.nickname != null ? `${banMember.nickname}` : "None"
        // Uppercase first letter of userstatsu
        const banMemberStatus = banMember.user.presence.status.charAt(0).toUpperCase() + banMember.user.presence.status.slice(1);
        // calculate ages
        var banMemberAccountAge = Math.floor((Date.now() - banMember.user.createdAt) / 1000 / 60 / 60 / 24);
        var banMemberMemberAge = Math.floor((Date.now() - banMember.joinedAt) / 1000 / 60 / 60 / 24);
        // display "None" if user playing status isn't set since value in field is required
        const banMemberPlaying = banMember.user.presence.game != null ? `${banMember.user.presence.game.name}` : "None"
        // rolelist, push everything BUT everyone
        var roleList = [];
        banMember.roles.forEach(role => {
            if (message.guild.id == role.id) {
                return;
            } else {
                roleList.push(role.name)
            }
        });
        // display list length in variable, so no roles can display as 0
        var roleListLength = roleList.length
        // display "None" if rolelist is empty since value in field is required
        roleList = roleList.length === 0 ? ["None"] : roleList
        roleListLength = roleList.length === 0 ? "0" : roleListLength
        // define embed
        message.channel.send({
                embed: {
                    color: 986895,
                    title: `Confirmation needed - ban`,
                    description: `:question: <@${message.member.id}>, you are about to ban this user with the reason: \r\n"${reason.join(" ")}"\r\n\r\nConfirm ban with pin **${pin}**, refuse with \`cancel\`\r\n`,
                    thumbnail: {
                        url: banMember.user.avatarURL
                    },
                    fields: [{
                            name: `Userinformation`,
                            value: `**Usertag:** ${isWhitelisted}${isBlacklisted}${isBot} ${banMember.user.tag}\r\n**ID:** ${banMember.user.id}\r\n**Mention:** <@${banMember.user.id}>\r\n**Nickname:** ${banMemberNickname}\r\n\r\n**Status:** ${banMemberStatus}\r\n**Playing:** ${banMemberPlaying}`,
                            inline: true
                        },
                        {
                            name: "Accountinformation",
                            value: `**Accountage:** ${banMemberAccountAge} day(s)\r\n**Memberage:** ${banMemberMemberAge} day(s)`,
                            inline: true
                        },
                        {
                            name: `Roles [${roleListLength}]`,
                            value: `${roleList.join(", ")}`,
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
                            banGuildMember(banMember);
                        } else {
                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ban request canceled`))
                                .then(message => {
                                    message.guild.me.lastMessage.delete(6000);
                                });
                        }

                        msg.delete(4000)
                        collectedMsg.first().delete(4000)
                        message.delete(0);
                    })
                    .catch(e => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ban request canceled`))
                            .then(message => {
                                message.guild.me.lastMessage.delete(6000);
                            });

                        msg.delete(4000)
                        message.delete(0);
                    })
            })
    }
    if (!message.member.hasPermission("BAN_MEMBERS")) {
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
    if (util.getGuildMember(mention, message)) {
        pinBan(util.getGuildMember(mention, message));
        return;
    } else {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${mention}** is not a valid guild member`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
    }
};
