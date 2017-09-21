// simple embed for bot responses
function createEmbed(color, message) {
    return {
        embed: {
            color: color,
            description: message
        }
    };
}
// random int generator
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}
// return user object for provided reference (username, nickname, mention, id, username#discrim) and message
// undefined if nothing is found
function getGuildMember(reference, message) {
    if (message.mentions.users.size === 1) {
        return message.mentions.members.first()
    }
    if (message.guild.members.get(`${reference}`)) {
        return message.guild.members.get(`${reference}`)
    }
    let queryUser = message.guild.members.find(function(member) {
        if (member.nickname != null) {
            if (member.nickname.toUpperCase() == reference.toUpperCase())
                return true;
        }
        if (`${member.user.tag}` == reference || member.user.username.toUpperCase() == reference.toUpperCase())
            return true;
    });
    if (queryUser) {
        return queryUser;
    } else {
        return undefined;
    }
}
// return role object for provided reference (rolename, mention, id) and message
// undefined if nothing is found
function getGuildRole(reference, message) {
    if (message.mentions.roles.size === 1) {
        return message.mentions.roles.first();
    }
    if (message.guild.roles.get(`${reference}`)) {
        return message.guild.roles.get(`${reference}`);
    }
    let queryRole = message.guild.roles.find(role => role.name.toUpperCase() == reference.toUpperCase() ? true : false);
    if (queryRole) {
        return queryRole;
    } else {
        return undefined;
    }
}
// return role EMBED for provided role (role! not rolename/identifier)
function createRoleEmbed(role, message) {
    // finding out stuff to later display in the embed
    let roleMembersOnline = [];
    let roleMembersOffline = [];
    let roleMembers = [];
    role.members.forEach(member => {
        roleMembers.push(`<@${member.id}>`);
        if (member.presence.status != "offline") {
            roleMembersOnline.push(`<@${member.id}>`)
        } else {
            roleMembersOffline.push(`<@${member.id}>`)
        }
    });
    let membersOnlineLength = roleMembersOnline.length;
    let membersOfflineLength = roleMembersOffline.length;
    let membersLength = roleMembers.length;
    if (roleMembersOnline.length == 0) {
        roleMembersOnline = ["None"];
        membersOnlineLength = 0;
    }
    if (roleMembersOffline.length == 0) {
        roleMembersOffline = ["None"];
        membersOfflineLength = 0;
    }
    if (roleMembers.length == 0) {
        roleMembers = ["None"];
        membersLength = 0;
    }
    let guildRoles = [];
    message.guild.roles.forEach(role => {
        if (role.id == message.guild.id) {
            return
        } else {
            guildRoles.push(role.name);
        }
    })
    embed = {
        embed: {
            color: role.color,
            author: {
                name: `${message.guild.name} - Role @${role.name}`,
                icon_url: message.guild.iconURL
            },
            title: "ID",
            description: `${role.id}`,
            fields: [{
                    name: "Name",
                    value: `${role.name}`,
                    inline: true
                },
                {
                    name: "Mention",
                    value: `<@&${role.id}>`,
                    inline: true
                },
                {
                    name: "Position",
                    value: `${role.position +1} of ${guildRoles.length + 1} `,
                    inline: true
                },
                {
                    name: "Managed by Application",
                    value: `${role.managed}`,
                    inline: true
                },
                {
                    name: "Mentionable",
                    value: `${role.mentionable}`,
                    inline: true
                },
                {
                    name: "Hoisted Role",
                    value: `${role.hoist}`,
                    inline: true
                },
                {
                    name: `Permissions`,
                    value: `${role.permissions}`,
                    inline: true
                },
                {
                    name: `Color (dec)`,
                    value: `${role.color}`,
                    inline: true
                },
                {
                    name: `Color (hex)`,
                    value: `${role.hexColor}`,
                    inline: true
                },
                {
                    name: `Created At`,
                    value: `${role.createdAt.toISOString().slice(0,10)}`,
                    inline: true
                },
                {
                    name: `Members [${membersOnlineLength}/${membersLength} online]`,
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
// return channel EMBED for provided channel (channel! not channelname/identifier)
function createChannelEmbed(channel, message) {
    let channelOverwrites = []
    channel.permissionOverwrites.forEach((value, key) => {
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
                name: `${message.guild.name} - Channel #${channel.name}`,
                icon_url: message.guild.iconURL
            },
            title: "ID",
            description: `${channel.id}`,
            fields: [{
                    name: "Name",
                    value: `${channel.name}`,
                    inline: true
                },
                {
                    name: "Link",
                    value: `<#${channel.id}>`,
                    inline: true
                },
                {
                    name: "Type",
                    value: `${channel.type}`,
                    inline: true
                },
                {
                    name: "Position",
                    value: `${channel.position +1}`,
                    inline: true
                },
                {
                    name: "Created On:",
                    value: `${channel.createdAt.toISOString().slice(0,10)}`,
                    inline: false
                },
                {
                    name: "Topic",
                    // catch the case that no topic is set, since fields need a value
                    value: `${channel.topic ? channel.topic : "None"}`,
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
// exports
exports.createEmbed = (color, message) => createEmbed(color, message);
exports.createRoleEmbed = (role, message) => createRoleEmbed(role, message);
exports.createChannelEmbed = (channel, message) => createChannelEmbed(channel, message);
exports.getRandInt = (min, max) => getRandInt(min, max);
exports.getGuildMember = (reference, message) => getGuildMember(reference, message);
exports.getGuildRole = (reference, message) => getGuildRole(reference, message);
