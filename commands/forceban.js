const config = require("../config.json");
const util = require("../foxxo.util.js");
exports.run = (client, message, [mention, ...reason]) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) {
        console.log(`!!! unauthorized command invoke !forceban by user <@${message.member.id}> | ${message.member.displayName} |  ${message.member.user.tag} ==> on <${mention}>`);
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
    client.fetchUser(mention)
        .then(forceBanMember => {
            var pin = util.getRandInt(1000, 9999);
            const isBot = forceBanMember.bot == true ? "🤖" : "";
            const forceBanMemberStatus = forceBanMember.presence.status.charAt(0).toUpperCase() + forceBanMember.presence.status.slice(1);
            const forceBanMemberPlaying = forceBanMember.presence.game == null ? "None" : forceBanMember.presence.game
            var forceBanMemberAccountAge = Math.floor((Date.now() - forceBanMember.createdAt) / 1000 / 60 / 60 / 24);
            message.channel.send({
                    embed: {
                        color: 986895,
                        title: `Confirmation needed - forceban`,
                        description: `:question: <@${message.member.id}>, is this the user you are looking for?\r\nConfirm forceban with pin **${pin}**, refuse with \`cancel\`\r\n`,
                        thumbnail: {
                            url: forceBanMember.avatarURL
                        },
                        fields: [{
                                name: `Userinformation`,
                                value: `**Usertag:** ${isBot} ${forceBanMember.tag}\r\n**ID:** ${forceBanMember.id}\r\n**Mention:** <@${forceBanMember.id}>\r\n\r\n**Status:** ${forceBanMemberStatus}\r\n**Playing:** ${forceBanMemberPlaying}`,
                                inline: true
                            },
                            {
                                name: "Accountinformation",
                                value: `**Accountage:** ${forceBanMemberAccountAge}`,
                                inline: true
                            }
                        ],
                        footer: {
                            text: `Request by ${message.member.displayName} (${message.author.id})`,
                            icon_url: message.author.avatarURL
                        }
                    }
                })
                .then(msg => {
                    msg.delete(30000)
                    message.channel.awaitMessages(response => response.author.id === message.author.id, {
                            max: 1,
                            time: 30000,
                            errors: [`time`],
                        })
                        .then(collectedMsg => {
                            if (collectedMsg.first().content === `${pin}`) {
                                message.guild.ban(mention, `${message.member.displayName} (ID: ${message.member.id}): ` + reason.join(" "))
                                    .then(forceBanMember => {
                                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully forcebanned ${forceBanMember.tag} | <@${forceBanMember.id}> | ID: ${forceBanMember.id}`));
                                    })
                                    .catch(error => {
                                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}> ${error}`))
                                            .then(message => {
                                                message.guild.me.lastMessage.delete(6000);
                                            });
                                    })
                            } else {
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, forceban request canceled`))
                                    .then(message => {
                                        message.guild.me.lastMessage.delete(6000);
                                    });
                            }
                            collectedMsg.first().delete(4000)
                            message.delete(4000);
                        })
                        .catch(e => {
                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, forceban request canceled`))
                                .then(message => {
                                    message.guild.me.lastMessage.delete(6000);
                                });
                            message.delete(0);
                        })
                })
        })

    //banning
    /*message.guild.ban(mention, `${message.member.displayName} (ID: ${message.member.id}): ` + reason.join(" "))
        .then(forceBanMember => {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully forcebanned ${forceBanMember.tag} | <@${forceBanMember.id}> | ID: ${forceBanMember.id}`));
        })
        .catch(error => {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}> ${error}`))
                .then(message => {
                    message.guild.me.lastMessage.delete(6000);
                });
        })*/
    //banning over
};
