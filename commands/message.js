const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, args) => {
    console.log(args[0])
    var msg = message.guild.channels.find(channel => {
        if (channel.messages.get(args[0])) {
            return channel
        } else {
            return false
        }
    })
    console.log(msg);
    /*if (msg) {
        const isBot = msg.author.bot == true ? "[BOT]" : "";
        const isPinned = msg.pinned == true ? ":pushpin:" : "";
        const isSystem = msg.system == true ? ":gear:" : "";
        const authorNickname = message.guild.members.get(msg.author.id).nickname
        message.channel.send({
            embed: {
                color: message.guild.me.displayColor,
                author: {
                    name: `Message parse for "${args[0]}" as requested by ${message.member.displayName}:`,
                    icon_url: message.member.avatarURL
                },
                title: "Author:",
                description: `${isBot} ${msg.author.tag} ${authorNickname} ID(${msg.author.id})`,
                thumbnail: {
                    url: msg.author.avatarURL
                },
                fields: [{
                        name: "Channel",
                        value: `${msg.channel.name} ID(${msg.channel.id})`,
                        inline: false
                    },
                    {
                        name: "Created At",
                        value: `${msg.createdAt}`,
                        inline: false
                    },
                    {
                        name: "Edited At",
                        value: `${msg.editedAt}`,
                        inline: false
                    },
                    {
                        name: "Content",
                        value: `${msg.content}`,
                        inline: false
                    },
                    {
                        name: "Versions",
                        value: `${msg.edits.join("\r\n")}`,
                        inline: false
                    },
                    {
                        name: "Embeds",
                        value: `${msg.embeds.join("\r\n")}`,
                        inline: false
                    },
                    {
                        name: `WebhookID`,
                        value: `${msg.webhookID}`,
                        inline: false
                    }
                ]
            }
        })
    }*/
}
