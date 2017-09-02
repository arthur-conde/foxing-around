const config = require("../config.json");
const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, [mention, ...options]) => {
    function createRoleEmbed(infoRole, message) {
        // finding out stuff to later display in the embed
        var roleMembersOnline = [];
        var roleMembersOffline = [];
        var roleMembers = [];
        infoRole.members.forEach(member => {
            roleMembers.push(`<@${member.id}>`);
            if (member.presence.status != "offline") {
                roleMembersOnline.push(`<@${member.id}>`)
            } else {
                roleMembersOffline.push(`<@${member.id}>`)
            }
        });
        var guildRoles = [];
        message.guild.roles.forEach(role => {
            if (role.id == message.guild.id) {
                return
            } else {
                guildRoles.push(role.name);
            }
        })
        embed = {
            embed: {
                color: infoRole.color,
                author: {
                    name: `${message.guild.name} - Role @${infoRole.name}`,
                    icon_url: message.guild.iconURL
                },
                title: "ID",
                description: `${infoRole.id}`,
                fields: [{
                        name: "Name",
                        value: `${infoRole.name}`,
                        inline: true
                    },
                    {
                        name: "Mention",
                        value: `<@&${infoRole.id}>`,
                        inline: true
                    },
                    {
                        name: "Position",
                        value: `${infoRole.position +1} of ${guildRoles.length + 1} `,
                        inline: true
                    },
                    {
                        name: "Managed by Application",
                        value: `${infoRole.managed}`,
                        inline: true
                    },
                    {
                        name: "Mentionable",
                        value: `${infoRole.mentionable}`,
                        inline: true
                    },
                    {
                        name: "Hoisted Role",
                        value: `${infoRole.hoist}`,
                        inline: true
                    },
                    {
                        name: `Permissions`,
                        value: `${infoRole.permissions}`,
                        inline: true
                    },
                    {
                        name: `Color (dec)`,
                        value: `${infoRole.color}`,
                        inline: true
                    },
                    {
                        name: `Color (hex)`,
                        value: `${infoRole.hexColor}`,
                        inline: true
                    },
                    {
                        name: `Created At`,
                        value: `${infoRole.createdAt.toISOString().slice(0,10)}`,
                        inline: true
                    },
                    {
                        name: `Members [${roleMembersOnline.length}/${roleMembers.length} online]`,
                        value: `online: ${roleMembersOnline.join(", ")} \noffline: ${roleMembersOffline.join(", ")}`,
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

    // if there is no mention part (!info is used)
    if (!mention) {
        message.channel.send(createUserEmbed(message.member, message));
        message.delete(4000);
        return;
    }

    if (message.mentions.roles.size === 1) {
        message.channel.send(createRoleEmbed(message.mentions.roles.first(), message));
        message.delete(4000);
        return;
    }
    if (message.guild.roles.get(`${mention}`) !== undefined) {
        message.channel.send(createRoleEmbed(message.guild.roles.get(`${mention}`), message));
        message.delete(4000);
        return;
    }
    var findRole = message.guild.roles.find(role => role.name.toUpperCase() == mention.toUpperCase() ? true : false);
    if (findRole != null) {
        message.channel.send(createRoleEmbed(findRole, message));
        message.delete(4000);
        return;
    } else {
        message.channel.send({
            embed: {
                color: message.guild.me.displayColor,
                description: `:x: <@${message.member.id}>, can't find any information for role **${mention}**`
            }
        }).then(message => {
            message.guild.me.lastMessage.delete(6000);
        });
        message.delete(4000);
    }
}
