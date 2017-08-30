const config = require("../config.json");
const util = require("../foxxo.util.js");
exports.run = (client, message, [mention, ...options]) => {
    function createUserEmbed(passedUser, message) {
        // finding out stuff to later display in the embed
        var infoUser = !passedUser ? message.member : passedUser;
        console.log(infoUser);
        const isBot = infoUser.user.bot == true ? "[BOT]" : "";
        const infoUserNickname = infoUser.nickname != null ? `${infoUser.nickname}` : "None"
        const infoUserStatus = infoUser.user.presence.status.charAt(0).toUpperCase() + infoUser.user.presence.status.slice(1);
        var infoUserAccountAge = Math.floor((Date.now() - infoUser.user.createdAt) / 1000 / 60 / 60 / 24);
        var infoUserMemberAge = Math.floor((Date.now() - infoUser.joinedAt) / 1000 / 60 / 60 / 24);
        const infoUserPlaying = infoUser.user.presence.game != null ? `${infoUser.user.presence.game.name}` : "None"
        const infoUserCreated = new Date(Date.UTC(infoUser.user.createdAt));
        var roleList = [];
        infoUser.roles.forEach(role => {
            if (message.guild.id == role.id) {
                return;
            } else {
                roleList.push(role.name)
            }
        });
        embed = {
            embed: {
                color: infoUser.displayColor,
                author: {
                    name: `${isBot} ${infoUser.user.tag}`,
                    icon_url: infoUser.user.avatarURL
                },
                title: "ID",
                description: `${infoUser.user.id}`,
                thumbnail: {
                    url: infoUser.user.avatarURL
                },
                fields: [{
                        name: "Mention",
                        value: `<@${infoUser.user.id}>`,
                        inline: true
                    },
                    {
                        name: "Nickname",
                        value: `${infoUserNickname}`,
                        inline: true
                    },
                    {
                        name: "Status",
                        value: `${infoUserStatus}`,
                        inline: true
                    },
                    {
                        name: "Playing",
                        value: `${infoUserPlaying}`,
                        inline: true
                    },
                    {
                        name: "Accountage",
                        value: `${infoUserAccountAge} day(s)`,
                        inline: true
                    },
                    {
                        name: "Memberage",
                        value: `${infoUserMemberAge} day(s)`,
                        inline: true
                    },
                    {
                        name: `Server Deafened`,
                        value: `${infoUser.serverDeaf}`,
                        inline: true
                    },
                    {
                        name: `Server Muted`,
                        value: `${infoUser.serverMute}`,
                        inline: true
                    },
                    {
                        name: "Created On",
                        value: `${infoUser.user.createdAt}`,
                        inline: false
                    },
                    {
                        name: "Join Date",
                        value: `${infoUser.joinedAt}`,
                        inline: false
                    },
                    {
                        name: `Roles [${roleList.length}]`,
                        value: `${roleList.join(", ")}`,
                        inline: false
                    }
                ]
            }
        }
        return embed;
    }

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
                    name: `${message.guild.name} - Role [${infoRole.name}]`,
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
                        value: `${infoRole.createdAt}`,
                        inline: false
                    },
                    {
                        name: `Members [${roleMembersOnline.length}/${roleMembers.length} online]`,
                        value: `online: ${roleMembersOnline.join(", ")} \noffline: ${roleMembersOffline.join(", ")}`,
                        inline: false
                    }
                ]
            }
        }
        return embed;
    }
    // If mention is guild ID or "guild" or "server"
    if (mention == `${message.guild.id}` || mention == "guild" || mention == "server") {
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
                guildVoiceChannels.push(channel.name)
            }
            if (channel.type == "text") {
                guildTextChannels.push(channel.name)
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
                guildRoles.push(role.name);
            }
        })
        var guildAge = Math.floor((Date.now() - message.guild.createdAt) / 1000 / 60 / 60 / 24);
        // If there are no further subcommands specified post guild info
        if (options.length == 0) {
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
                            value: `${message.guild.memberCount} (${onlineMembers.length} online)`,
                            inline: true
                        },
                        {
                            name: `Channels [${guildChannels.length}]`,
                            value: `text: ${guildTextChannels.length} | voice: ${guildVoiceChannels.length}`,
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
                            name: "Roles",
                            value: `${guildRoles.length}`,
                            inline: true
                        },
                        {
                            name: "Created On",
                            value: `${message.guild.createdAt}`,
                            inline: true
                        },
                    ]
                }
            });
        }
        // if subcommand roles is provided post roles list
        if (options.toString().toUpperCase() == "roles".toUpperCase()) {
            message.channel.send({
                embed: {
                    color: message.guild.me.displayColor,
                    author: {
                        name: `${message.guild.name} - Roles [${guildRoles.length}]`,
                        icon_url: message.guild.iconURL
                    },
                    description: `${guildRoles.join(", ")}`
                }
            });
        }
        // if subcommand channels is provided post channel info
        if (options.toString().toUpperCase() == "channels".toUpperCase()) {
            message.channel.send({
                embed: {
                    color: message.guild.me.displayColor,
                    author: {
                        name: `${message.guild.name} - Channels [${guildChannels.length}]`,
                        icon_url: message.guild.iconURL
                    },
                    fields: [{
                            name: `Textchannels [${guildTextChannels.length}]`,
                            value: `${guildTextChannels.join(", ")}`
                        },
                        {
                            name: `Voicechannels [${guildVoiceChannels.length}]`,
                            value: `${guildVoiceChannels.join(", ")}`
                        }
                    ]
                }
            })
        }
        message.delete(4000);
        return;
    }
    // if there is no mention part (!info is used)
    if (!mention) {
        message.channel.send(createUserEmbed(message.member, message));
        message.delete(4000);
        return;
    }
    // if there is a mention in mention
    if (message.mentions.users.size === 1) {
        message.channel.send(createUserEmbed(message.mentions.members.first(), message));
        message.delete(4000);
        return;
    }
    // if there is a valid ID in mention
    if (message.guild.members.get(`${mention}`) !== undefined) {
        message.channel.send(createUserEmbed(message.guild.members.get(`${mention}`), message));
        message.delete(4000);
        return;
    }
    // if neither are the case search in guild.members for nick- and usernames matching mention (cas-insensitive via toUpperCase())
    var nickUser = message.guild.members.find(function(member) {
        if (member.nickname != null) {
            if (member.nickname.toUpperCase() == mention.toUpperCase())
                return true;
        }
        if (member.user.username.toUpperCase() == mention.toUpperCase())
            return true;
    })
    // if search was successful post userinfo (calls function from earlier)
    if (nickUser != null) {
        message.channel.send(createUserEmbed(nickUser, message));
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
        // if not, ask user to provide a different mention
        message.channel.send({
            embed: {
                color: message.guild.me.displayColor,
                description: `:x: <@${message.member.id}>, can't find any information for **${mention}**`
            }
        }).then(message => {
            message.guild.me.lastMessage.delete(6000);
        });
        message.delete(4000);
    }
}
