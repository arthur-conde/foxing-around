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
                const isBot = msg.author.bot == true ? "[BOT]" : "";
                const isPinned = msg.pinned == true ? "📌" : "";
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
                                text: `${msg.createdAt.toISOString().slice(0,10)} at ${msg.createdAt.toISOString().slice(11,16)}`
                            }
                        }
                    })
                } else {
                    if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id !== config.ownerID) {
                        return;
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
                                text: `${msg.createdAt.toISOString().slice(0,10)} at ${msg.createdAt.toISOString().slice(11,16)} | ${msg.editedAt == null ? "No Edits" : "last edit:" + msg.editedAt.toISOString().slice(0,10) + " at"}  ${msg.editedAt == null ? "" : msg.editedAt.toISOString().slice(11,16)}`
                            }
                        }
                    })
                }
            }
        })
    message.delete(4000);
}
