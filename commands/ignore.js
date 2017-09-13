const config = require("../config.json");
const util = require("../foxxo.util.js");
const fs = require("fs")
exports.run = (client, message, [mention]) => {
    if (!config.owner.includes(`${message.author.id}`)) {
        return;
    }
    if (!mention) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, please provide a guild member to ignore`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (mention == config.ownerID || mention == config.teachID || mention == client.user.id) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, you can't add this user to the ignore list`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    client.fetchUser(mention)
        .then(ignoreMember => {
            if (config.ignoredUsers.includes(ignoreMember.id)) {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, user is already ignored`))
                    .then(message => {
                        message.guild.me.lastMessage.delete(6000);
                    });
                message.delete(4000);
                return;
            }
            var pin = util.getRandInt(1000, 9999);
            const isBot = ignoreMember.bot == true ? "🤖" : "";
            const ignoreMemberStatus = ignoreMember.presence.status.charAt(0).toUpperCase() + ignoreMember.presence.status.slice(1);
            const ignoreMemberPlaying = ignoreMember.presence.game == null ? "None" : ignoreMember.presence.game
            var ignoreMemberAccountAge = Math.floor((Date.now() - ignoreMember.createdAt) / 1000 / 60 / 60 / 24);
            message.channel.send({
                    embed: {
                        color: 16426522,
                        title: `Confirmation needed - ignore`,
                        description: `:question: <@${message.member.id}>, you are about to ignore this user\r\n\r\nConfirm ignore with pin **${pin}**, refuse with \`cancel\`\r\n`,
                        thumbnail: {
                            url: ignoreMember.avatarURL
                        },
                        fields: [{
                                name: `Userinformation`,
                                value: `**Usertag:** ${isBot} ${ignoreMember.tag}\r\n**ID:** ${ignoreMember.id}\r\n**Mention:** <@${ignoreMember.id}>\r\n\r\n**Status:** ${ignoreMemberStatus}\r\n**Playing:** ${ignoreMemberPlaying}`,
                                inline: false
                            },
                            {
                                name: "Accountinformation",
                                value: `**Accountage:** ${ignoreMemberAccountAge}`,
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
                                config.ignoredUsers.push(ignoreMember.id);
                                fs.writeFile("./config.json", JSON.stringify(config, null, 4), (err) => console.error);
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully ignored ${ignoreMember.tag} | <@${ignoreMember.id}> | ID: ${ignoreMember.id}`));
                            } else {
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ignore request canceled`))
                                    .then(message => {
                                        message.guild.me.lastMessage.delete(6000);
                                    });
                            }
                            msg.delete(4000)
                            collectedMsg.first().delete(4000)
                            message.delete(4000);
                        })
                        .catch(e => {
                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ignore request canceled`))
                                .then(message => {
                                    message.guild.me.lastMessage.delete(6000);
                                });
                            message.delete(0);
                        })
                })
        })
};
