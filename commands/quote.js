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
                            color: message.guild.me.displayColor,
                            author: {
                                name: `${isPinned} ${isBot}${msg.member.displayName} (ID:${msg.author.id})`,
                                icon_url: msg.author.avatarURL
                            },
                            description: `${msg.content}`,
                            footer: {
                                text: `${msg.createdAt.toISOString().slice(0,10)}`
                            }
                        }
                    })
                } else {
                    message.channel.send({
                        embed: {
                            color: message.guild.me.displayColor,
                            author: {
                                name: `${isPinned} ${isBot}${msg.member.displayName} (ID:${msg.author.id}) wrote..`,
                                icon_url: msg.author.avatarURL
                            },
                            description: `${msg.edits.join("\r\n\r\n")}`,
                            footer: {
                                text: `${msg.createdAt.toISOString().slice(0,10)} | last edit: ${msg.editedAt.toISOString().slice(0,10)}`
                            }
                        }
                    })
                }
            }
        })
    message.delete(4000);
}
