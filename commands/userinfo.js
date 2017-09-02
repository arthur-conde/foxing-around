const config = require("../config.json");
const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, [mention, ...options]) => {
    function createUserEmbed(passedUser, message) {
        // finding out stuff to later display in the embed
        // default to message sender if no user is passed
        var infoUser = !passedUser ? message.member : passedUser;
        // check if bot
        const isBot = infoUser.user.bot == true ? "🤖" : "";
        const isAdmin = infoUser.hasPermission("ADMINISTRATOR") == true ? "🅰" : ""
        // check if Nickname is present, if not display "None" since value in field is required
        const infoUserNickname = infoUser.nickname != null ? `${infoUser.nickname}` : "None"
        // Uppercase first letter of userstatsu
        const infoUserStatus = infoUser.user.presence.status.charAt(0).toUpperCase() + infoUser.user.presence.status.slice(1);
        // calculate ages
        var infoUserAccountAge = Math.floor((Date.now() - infoUser.user.createdAt) / 1000 / 60 / 60 / 24);
        var infoUserMemberAge = Math.floor((Date.now() - infoUser.joinedAt) / 1000 / 60 / 60 / 24);
        // display "None" if user playing status isn't set since value in field is required
        const infoUserPlaying = infoUser.user.presence.game != null ? `${infoUser.user.presence.game.name}` : "None"
        // rolelist, push everything BUT everyone
        var roleList = [];
        infoUser.roles.forEach(role => {
            if (message.guild.id == role.id) {
                return;
            } else {
                roleList.push(role.name)
            }
        });
        // display list length in variable, so no roles can display as 0
        var roleListLength = roleList.length
        // display "None" if rolelist is empty since value in field is required
        roleList = roleList.length === 0 ? ["None"] : roleList
        roleListLength = roleList.length === 0 ? "0" : roleListLength
        // define embed
        embed = {
            embed: {
                color: infoUser.displayColor,
                author: {
                    name: `${isAdmin} ${isBot} ${infoUser.user.tag}`,
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
                        value: `${infoUser.user.createdAt.toISOString().slice(0,10)}`,
                        inline: true
                    },
                    {
                        name: "Join Date",
                        value: `${infoUser.joinedAt.toISOString().slice(0,10)}`,
                        inline: true
                    },
                    {
                        name: `Roles[${roleListLength}]`,
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
    } else {
        message.channel.send({
            embed: {
                color: message.guild.me.displayColor,
                description: `:x: <@${message.member.id}>, can 't find any information for user **${mention}**`
            }
        }).then(message => {
            message.guild.me.lastMessage.delete(6000);
        });
        message.delete(4000);
    }
}
