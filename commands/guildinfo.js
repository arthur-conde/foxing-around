const config = require("../config.json");
const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, [mention, ...options]) => {
    // finding information to later display in embed
    var onlineMembers = [];
    message.guild.members.forEach(member => {
        if (member.presence.status == "online" || member.presence.status == "dnd" || member.presence.status == "idle") {
            onlineMembers.push(member.id)
        } else {
            return
        }
    });
    var guildVoiceChannels = [];
    var guildTextChannels = [];
    message.guild.channels.forEach(channel => {
        if (channel.type == "voice") {
            guildVoiceChannels.push(`<#${channel.id}>`)
        }
        if (channel.type == "text") {
            guildTextChannels.push(`<#${channel.id}>`)
        } else {
            return
        }
    })
    var guildChannels = guildTextChannels.concat(guildVoiceChannels);
    var guildRoles = [];
    message.guild.roles.forEach(role => {
        if (role.id == message.guild.id) {
            return
        } else {
            guildRoles.push(`<@&${role.id}>`);
        }
    })
    // exception fetching because field values are required
    // adapting length
    guildVoiceChannels = guildVoiceChannels.length === 0 ? ["None"] : guildVoiceChannels;
    guildVoiceChannelsLength = guildVoiceChannels.length === 0 ? "0" : guildVoiceChannels.length;
    guildTextChannels = guildTextChannels.length === 0 ? ["None"] : guildTextChannels;
    guildTextChannelsLength = guildTextChannels.length === 0 ? "0" : guildTextChannels.length;
    guildChannels = guildChannels.length === 0 ? ["None"] : guildChannels;
    guildChannelsLength = guildChannels.length === 0 ? "0" : guildChannels.length;
    guildRoles = guildRoles.length === 0 ? ["None"] : guildRoles;
    guildRolesLength = guildRoles.length === 0 ? "0" : guildRoles.length;
    onlineMembers = onlineMembers.length === 0 ? ["None"] : onlineMembers;
    onlineMembersLength = onlineMembers.length === 0 ? "0" : onlineMembers.length
    // calculate guild age
    var guildAge = Math.floor((Date.now() - message.guild.createdAt) / 1000 / 60 / 60 / 24);
    message.channel.send({
        embed: {
            color: message.guild.me.displayColor,
            author: {
                name: `${message.guild.name}`,
                icon_url: message.guild.iconURL
            },
            title: "ID",
            description: `${message.guild.id}`,
            thumbnail: {
                url: message.guild.iconURL
            },
            fields: [{
                    name: "Region",
                    value: `${message.guild.region}`,
                    inline: true
                },
                {
                    name: "Members",
                    value: `${message.guild.memberCount} (${onlineMembersLength} online)`,
                    inline: true
                },
                {
                    name: "Guild Owner",
                    value: `<@${message.guild.ownerID}>`,
                    inline: true
                },
                {
                    name: "Age",
                    value: `${guildAge} day(s)`,
                    inline: true
                },
                {
                    name: "Created On",
                    value: `${message.guild.createdAt}`,
                    inline: true
                },
                {
                    name: `Textchannels [${guildTextChannelsLength}]`,
                    value: `${guildTextChannels.join(", ")}`,
                    inline: true
                },
                {
                    name: `Voicechannels [${guildVoiceChannelsLength}]`,
                    value: `${guildVoiceChannels.join(", ")}`,
                    inline: true
                },
                {
                    name: `Roles [${guildRolesLength}]`,
                    value: `${guildRoles.join(", ")}`,
                    inline: true
                }
            ],
            footer: {
                text: `Request by ${message.member.displayName} (${message.author.id})`,
                icon_url: message.author.avatarURL
            }
        }
    });
    message.delete(4000);
    return;
}
