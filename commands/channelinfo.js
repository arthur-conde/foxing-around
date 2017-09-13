const config = require("../config/config.json");
const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, [mention, ...options]) => {
    // defining the embed function layout
    function createChannelEmbed(infoChannel, message) {
        var channelOverwrites = []
        infoChannel.permissionOverwrites.forEach((value, key) => {
            // if permission is rolebased display role highlighting <@&> else, use user highlighting <@>
            // @everyone is a normal role with the ID of guild and displays as @@everyone when called
            if (value.type === "role") {
                channelOverwrites.push(`▫<@&${key}> | Deny: ${value.deny} | Allow: ${value.allow}`)
            } else {
                channelOverwrites.push(`▫<@${key}> | Deny: ${value.deny} | Allow: ${value.allow}`)
            }
        })
        // catch the case that no channeloverwrites are set, since fields need a value
        if (channelOverwrites.length === 0) {
            channelOverwrites = ["None"]
        }
        // actual embed
        embed = {
            embed: {
                color: message.guild.me.displayColor,
                author: {
                    name: `${message.guild.name} - Channel #${infoChannel.name}`,
                    icon_url: message.guild.iconURL
                },
                title: "ID",
                description: `${infoChannel.id}`,
                fields: [{
                        name: "Name",
                        value: `${infoChannel.name}`,
                        inline: true
                    },
                    {
                        name: "Link",
                        value: `<#${infoChannel.id}>`,
                        inline: true
                    },
                    {
                        name: "Type",
                        value: `${infoChannel.type}`,
                        inline: true
                    },
                    {
                        name: "Position",
                        value: `${infoChannel.position +1}`,
                        inline: true
                    },
                    {
                        name: "Created On:",
                        value: `${infoChannel.createdAt.toISOString().slice(0,10)}`,
                        inline: false
                    },
                    {
                        name: "Topic",
                        // catch the case that no topic is set, since fields need a value
                        value: `${infoChannel.topic ? infoChannel.topic : "None"}`,
                        inline: false
                    },
                    {
                        name: "Permission Overwrites",
                        value: channelOverwrites.join(`\n`),
                        inline: false
                    }
                ],
                footer: {
                    text: `Request by ${message.member.displayName} (${message.author.id})`,
                    icon_url: message.author.avatarURL
                }
            }
        }
        return embed;
    }
    // if there is no mention part (!info is used) default to channel the command is called in
    if (!mention) {
        message.channel.send(createChannelEmbed(message.channel, message));
        message.delete(4000);
        return;
    }
    // if channel is mentioned as actual channel mention
    if (message.mentions.channels.size === 1) {
        message.channel.send(createChannelEmbed(message.mentions.channels.first(), message));
        message.delete(4000);
        return;
    }
    // if there is a valid ID in mention
    if (message.guild.channels.get(`${mention}`) !== undefined) {
        message.channel.send(createChannelEmbed(message.guild.channels.get(`${mention}`), message));
        message.delete(4000);
        return;
    }
    // if ID is invalid, search mention as channelname
    var findChannel = message.guild.channels.find(function(channel) {
        if (channel.name.toUpperCase() == mention.toUpperCase())
            return true;
    })
    // if search found something csend message, else display error
    if (findChannel != null) {
        message.channel.send(createChannelEmbed(findChannel, message));
        message.delete(4000);
        return;
    } else {
        message.channel.send({
            embed: {
                color: message.guild.me.displayColor,
                description: `:x: <@${message.member.id}>, can't find any information for channel **${mention}**`
            }
        }).then(message => {
            message.guild.me.lastMessage.delete(6000);
        });
        message.delete(4000);
    }
}
