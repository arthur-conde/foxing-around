const config = require("../config.json");
const util = require("../foxxo.util.js");
exports.run = (client, message, [mention, ...reason]) => {
    function kickGuildMember(kickMember) {
        kickMember.kick(`${message.member.displayName} (ID: ${message.member.id}) ` + reason.join(" "))
            .then(member => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully kicked ${kickMember.displayName} | <@${kickMember.id}> | ID: ${kickMember.id}`))
            });
    }

    function pinKick(kickMember) {
        var pin = util.getRandInt(1000, 9999);
        // finding out stuff to later display in the embed
        // check if bot
        const isBot = kickMember.user.bot == true ? "🤖" : "";
        // check if Nickname is present, if not display "None" since value in field is required
        const kickMemberNickname = kickMember.nickname != null ? `${kickMember.nickname}` : "None"
        // Uppercase first letter of userstatsu
        const kickMemberStatus = kickMember.user.presence.status.charAt(0).toUpperCase() + kickMember.user.presence.status.slice(1);
        // calculate ages
        var kickMemberAccountAge = Math.floor((Date.now() - kickMember.user.createdAt) / 1000 / 60 / 60 / 24);
        var kickMemberMemberAge = Math.floor((Date.now() - kickMember.joinedAt) / 1000 / 60 / 60 / 24);
        // display "None" if user playing status isn't set since value in field is required
        const kickMemberPlaying = kickMember.user.presence.game != null ? `${kickMember.user.presence.game.name}` : "None"
        // rolelist, push everything BUT everyone
        var roleList = [];
        kickMember.roles.forEach(role => {
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
                    color: 13650249,
                    title: `Confirmation needed - kick`,
                    description: `:question: <@${message.member.id}>, is this the user you are looking for?\r\nConfirm kick with pin **${pin}**, refuse with \`cancel\`\r\n`,
                    thumbnail: {
                        url: kickMember.user.avatarURL
                    },
                    fields: [{
                            name: `Userinformation:`,
                            value: `**Usertag:** ${isBot} ${kickMember.user.tag}\r\n**ID:** ${kickMember.user.id}\r\n**Mention:** <@${kickMember.user.id}>\r\n**Nickname:** ${kickMemberNickname}\r\n\r\n**Status:** ${kickMemberStatus}\r\n**Playing:** ${kickMemberPlaying}`,
                            inline: true
                        },
                        {
                            name: "Accountinformation",
                            value: `**Accountage:** ${kickMemberAccountAge} day(s)\r\n**Memberage:** ${kickMemberMemberAge} day(s)`,
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
                            kickGuildMember(kickMember);
                        } else {
                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, kick request canceled`))
                                .then(message => {
                                    message.guild.me.lastMessage.delete(6000);
                                });
                        }
                        collectedMsg.first().delete(4000)
                        msg.delete(4000)
                        message.delete(4000);
                    })
                    .catch(e => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, kick request canceled`))
                            .then(message => {
                                message.guild.me.lastMessage.delete(6000);
                            });
                        message.delete(0);
                        msg.delete(4000)
                    })
            })
    }

    if (!message.member.hasPermission("KICK_MEMBERS")) {
        console.log(`[!!!] unauthorized command invoke !kick by user <@${message.member.id}>,${message.member.displayName}, ${message.member.user.tag} || on <${mention}>`);
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
    if (util.getGuildMember(mention, message)) {
        pinKick(util.getGuildMember(mention, message));
        return;
    } else {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${mention}** is not a valid guild member`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
    }
}
