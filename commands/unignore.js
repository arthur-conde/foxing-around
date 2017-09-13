const config = require("../config.json");
const util = require("../foxxo.util.js");
const fs = require("fs")
exports.run = (client, message, [mention]) => {
    if (!config.owner.includes(`${message.author.id}`)) {
        return;
    }
    if (!mention) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, please provide a guild member to unignore`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    client.fetchUser(mention)
        .then(unignoreMember => {
            if (!config.ignoredUsers.includes(unignoreMember.id)) {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, user is not on the list of ignored users`))
                    .then(message => {
                        message.guild.me.lastMessage.delete(6000);
                    });
                message.delete(4000);
                return;
            }
            var pin = util.getRandInt(1000, 9999);
            const isBot = unignoreMember.bot == true ? "🤖" : "";
            const isWhitelisted = config.whitelist.includes(`${unignoreMember.id}`) == true ? "[🔑Whitelist]" : ""
            const isBlacklisted = config.blacklist.includes(`${unignoreMember.id}`) == true ? "[⛔Blacklist]" : ""
            const isOwner = config.owner.includes(`${unignoreMember.id}`) == true ? "[🦊Owner]" : ""
            const unignoreMemberStatus = unignoreMember.presence.status.charAt(0).toUpperCase() + unignoreMember.presence.status.slice(1);
            const unignoreMemberPlaying = unignoreMember.presence.game == null ? "None" : unignoreMember.presence.game
            var unignoreMemberAccountAge = Math.floor((Date.now() - unignoreMember.createdAt) / 1000 / 60 / 60 / 24);
            message.channel.send({
                    embed: {
                        color: 16426522,
                        title: `Confirmation needed - unignore`,
                        description: `:question: <@${message.member.id}>, you are about to remove this user from the ignore list\r\n\r\nConfirm with pin **${pin}**, refuse with \`cancel\`\r\n`,
                        thumbnail: {
                            url: unignoreMember.avatarURL
                        },
                        fields: [{
                                name: `Userinformation`,
                                value: `**Usertag:** ${isWhitelisted}${isBlacklisted}${isBot} ${unignoreMember.tag}\r\n**ID:** ${unignoreMember.id}\r\n**Mention:** <@${unignoreMember.id}>\r\n\r\n**Status:** ${unignoreMemberStatus}\r\n**Playing:** ${unignoreMemberPlaying}`,
                                inline: false
                            },
                            {
                                name: "Accountinformation",
                                value: `**Accountage:** ${unignoreMemberAccountAge}`,
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
                                var index = config.ignoredUsers.indexOf(unignoreMember.id);
                                config.ignoredUsers.splice(index, 1);
                                fs.writeFile("./config.json", JSON.stringify(config, null, 4), (err) => console.error);
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully removed ${unignoreMember.tag} | <@${unignoreMember.id}> | ID: ${unignoreMember.id} from the ignore list`));
                            } else {
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, unignore request canceled`))
                                    .then(message => {
                                        message.guild.me.lastMessage.delete(6000);
                                    });
                            }
                            msg.delete(4000)
                            collectedMsg.first().delete(4000)
                            message.delete(4000);
                        })
                        .catch(e => {
                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, unignore request canceled`))
                                .then(message => {
                                    message.guild.me.lastMessage.delete(6000);
                                });
                            message.delete(0);
                        })
                })
        })
};
