const config = require("../config/config.json");
const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, args) => {
    console.log(config.list)
    var list = args[0];
    var option = args[1];
    var mention = args[2];
    var viableLists = ["blacklist", "whitelist", "owner"]
    var viableOptions = ["add", "remove", "+", "-"]
    // check if invoking user is owner
    if (!config.owner.includes(`${message.author.id}`)) {
        return;
    }
    // check if all arguments are present
    if (!list || !option || !mention) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, provide a full set of arguments in the form of \`!config <list> <add | remove> <member>\``))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    // check if argument list is valid
    if (!viableLists.includes(list)) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${list}** is not a valid argument`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    // check if argument option is valid
    if (!viableOptions.includes(option)) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${option}** is not a valid argument`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    // try to fetch user, check if user provided is actually a user ID
    client.fetchUser(mention, true)
        .then(fetchedUser => {
            console.log(fetchedUser.tag)
            // if user is found and fetched
            // check if user is already on provided list (checks all lists)
            if (config.list.includes(fetchedUser.id)) {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, <@${fetchedUser.id}> is already on "${list}"`))
                    .then(message => {
                        message.guild.me.lastMessage.delete(6000);
                    });
                message.delete(4000);
                return;
            }
            // find things out
            var pin = util.getRandInt(1000, 9999);
            const isBot = fetchedUser.bot == true ? "🤖" : "";
            const isWhitelisted = config.whitelist.includes(`${fetchedUser.id}`) == true ? "[🔑Whitelist]" : ""
            const isBlacklisted = config.blacklist.includes(`${fetchedUser.id}`) == true ? "[⛔Blacklist]" : ""
            const isOwner = config.owner.includes(`${fetchedUser.id}`) == true ? "[🦊Owner]" : ""
            const ignoreMemberStatus = fetchedUser.presence.status.charAt(0).toUpperCase() + fetchedUser.presence.status.slice(1);
            const ignoreMemberPlaying = fetchedUser.presence.game == null ? "None" : fetchedUser.presence.game
            var ignoreMemberAccountAge = Math.floor((Date.now() - fetchedUser.createdAt) / 1000 / 60 / 60 / 24);
            message.channel.send({
                    embed: {
                        color: 16426522,
                        title: `Confirmation needed - Config - ${list} - ${option}`,
                        description: `:question: <@${message.member.id}>, you are about to change this users config with the following arguments: list: ${list} | option: ${option}\r\n\r\nConfirm ignore with pin **${pin}**, refuse with \`cancel\`\r\n`,
                        thumbnail: {
                            url: ignoreMember.avatarURL
                        },
                        fields: [{
                                name: `Userinformation`,
                                value: `**Usertag:** ${isWhitelisted}${isBlacklisted}${isBot} ${ignoreMember.tag}\r\n**ID:** ${ignoreMember.id}\r\n**Mention:** <@${ignoreMember.id}>\r\n\r\n**Status:** ${ignoreMemberStatus}\r\n**Playing:** ${ignoreMemberPlaying}`,
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
                                if (option == "add" || option == "+") {
                                    config.list.push(fetchedUser.id);
                                    fs.writeFile("./config/config.json", JSON.stringify(config, null, 4), (err) => console.error);
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully changed config for ${ignoreMember.tag} | <@${ignoreMember.id}> | ID: ${ignoreMember.id} with the following arguments: list: ${list} | option: ${option}`));
                                }
                                if (option == "remove" || option == "-") {
                                    var index = config.list.indexOf(fetchedUser.id);
                                    config.ignoredUsers.splice(index, 1);
                                    fs.writeFile("./config/config.json", JSON.stringify(config, null, 4), (err) => console.error);
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully changed config for ${ignoreMember.tag} | <@${ignoreMember.id}> | ID: ${ignoreMember.id} with the following arguments: list: ${list} | option: ${option}`));
                                }
                            } else {
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, config change request canceled`))
                                    .then(message => {
                                        message.guild.me.lastMessage.delete(6000);
                                    });
                            }
                            msg.delete(4000)
                            collectedMsg.first().delete(4000)
                            message.delete(4000);
                        })
                        .catch(e => {
                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, config change request canceled`))
                                .then(message => {
                                    message.guild.me.lastMessage.delete(6000);
                                });
                            message.delete(0);
                        })
                })
        })
        .catch(error => { // if no user is found display error message
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${mention}** is not a valid user`))
                .then(message => {
                    message.guild.me.lastMessage.delete(6000);
                });
            console.log(error);
            message.delete(4000);
            return;
        })
}
