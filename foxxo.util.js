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
// return member EMBED for provided member (member! not identifier/name/user)
function createUserEmbed(guildmember, message) {
    // finding out stuff to later display in the embed
    // check if bot/admin
    const isBot = guildmember.user.bot == true ? "🤖" : "";
    const isWhitelisted = config.whitelist.includes(`${guildmember.id}`) == true ? "[🔑Whitelist]" : ""
    const isBlacklisted = config.blacklist.includes(`${guildmember.id}`) == true ? "[⛔Blacklist]" : ""
    const isOwner = config.owner.includes(`${guildmember.id}`) == true ? "[🦊Owner]" : ""
    // check if Nickname is present, if not display "None" since value in field is required
    const passedUserNickname = guildmember.nickname != null ? `${guildmember.nickname}` : "None"
    // Uppercase first letter of status
    const passedUserStatus = guildmember.user.presence.status.charAt(0).toUpperCase() + guildmember.user.presence.status.slice(1);
    // display "None" if user playing status isn't set since value in field is required
    const passedUserPlaying = guildmember.user.presence.game != null ? `${guildmember.user.presence.game.name}` : "None"
    // calculate ages
    let passedUserAccountAge = Math.floor((Date.now() - guildmember.user.createdAt) / 1000 / 60 / 60 / 24);
    let passedUserMemberAge = Math.floor((Date.now() - guildmember.joinedAt) / 1000 / 60 / 60 / 24);
    // rolelist, push everything BUT everyone (guild ID = role ID)
    let roleList = [];
    guildmember.roles.forEach(role => {
        if (message.guild.id == role.id) {
            return;
        } else {
            roleList.push(role.name)
        }
    });
    // display list length in variable, so no roles can display as 0
    let roleListLength = roleList.length
    // display "None" if rolelist is empty since value in field is required
    roleList = roleList.length === 0 ? ["None"] : roleList
    roleListLength = roleList.length === 0 ? "0" : roleListLength
    // define embed
    embed = {
        embed: {
            color: guildmember.displayColor,
            author: {
                name: `${isOwner} ${isWhitelisted}${isBlacklisted}${isBot} ${guildmember.user.tag}`,
                icon_url: guildmember.user.avatarURL
            },
            title: "ID",
            description: `${guildmember.user.id}`,
            thumbnail: {
                url: guildmember.user.avatarURL
            },
            fields: [{
                    name: "Mention",
                    value: `<@${guildmember.user.id}>`,
                    inline: true
                },
                {
                    name: "Nickname",
                    value: `${passedUserNickname}`,
                    inline: true
                },
                {
                    name: "Status",
                    value: `${passedUserStatus}`,
                    inline: true
                },
                {
                    name: "Playing",
                    value: `${passedUserPlaying}`,
                    inline: true
                },
                {
                    name: "Accountage",
                    value: `${passedUserAccountAge} day(s)`,
                    inline: true
                },
                {
                    name: "Memberage",
                    value: `${passedUserMemberAge} day(s)`,
                    inline: true
                },
                {
                    name: `Server Deafened`,
                    value: `${guildmember.serverDeaf}`,
                    inline: true
                },
                {
                    name: `Server Muted`,
                    value: `${guildmember.serverMute}`,
                    inline: true
                },
                {
                    name: "Created On",
                    value: `${guildmember.user.createdAt.toISOString().slice(0,10)}`,
                    inline: true
                },
                {
                    name: "Join Date",
                    value: `${guildmember.joinedAt.toISOString().slice(0,10)}`,
                    inline: true
                },
                {
                    name: `Roles [${roleListLength}]`,
                    value: `${roleList.join(", ")}`,
                    inline: false
                }
            ],
            footer: {
                text: `Request by ${message.member.displayName}(${message.author.id})`,
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
