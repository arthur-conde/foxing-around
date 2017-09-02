const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, [messageID, edits, channelID]) => {
    if (!channelID) channelID = message.channel.id;
    if (!edits) edits = "false";
    var msg
    message.guild.channels.get(channelID.toString()).fetchMessage(messageID.toString())
        .then(m => {
            msg = m
            if (msg) {
                const isBot = msg.author.bot == true ? "🤖" : "";
                const isPinned = msg.pinned == true ? "📌" : "";
                var msgInChannel
                if (msg.channel.id === message.channel.id) {
                    msgInChannel = ""
                } else {
                    msgInChannel = " in #" + msg.channel.name
                }
                if (edits === "false") {
                    message.channel.send({
                        embed: {
                            color: msg.member.displayColor,
                            author: {
                                name: `${isPinned} ${isBot}${msg.member.displayName}`,
                                icon_url: msg.author.avatarURL
                            },
                            description: `${msg.content}`,
                            footer: {
                                text: `${msg.createdAt.toISOString().slice(0,10)} at ${msg.createdAt.toISOString().slice(11,16)}` + `${msgInChannel}`
                            }
                        }
                    })
                } else {
                    if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id !== config.ownerID) {
                        return;
                    }
                    var msgEditedAt
                    if (msg.editedAt == null) {
                        msgEditedAt = " | no edits"
                    } else {
                        msgEditedAt = " | last edit: " + msg.editedAt.toISOString().slice(0, 10) + " at " + msg.editedAt.toISOString().slice(11, 16)
                    }
                    message.channel.send({
                        embed: {
                            color: msg.member.displayColor,
                            author: {
                                name: `${isPinned} ${isBot}${msg.member.displayName}`,
                                icon_url: msg.author.avatarURL
                            },
                            description: `_ _\r\n${msg.edits.join("\r\n")}`,
                            footer: {
                                text: `${msg.createdAt.toISOString().slice(0,10)} at ${msg.createdAt.toISOString().slice(11,16)}` + `${msgInChannel}` + `${msgEditedAt}`
                            }
                        }
                    })
                }
            }
        })
    message.delete(4000);
}
