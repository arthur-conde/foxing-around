const config = require("../config.json");
const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, [mention, ...options]) => {
    function createUserEmbed(passedUser, message) {
        // finding out stuff to later display in the embed
        // check if bot/admin
        const isBot = passedUser.user.bot == true ? "🤖" : "";
        const isWhitelisted = config.whitelist.includes(`${passedUser.id}`) == true ? "[🔑Whitelist]" : ""
        const isBlacklisted = config.blacklist.includes(`${passedUser.id}`) == true ? "[⛔Blacklist]" : ""
        const isOwner = config.owner.includes(`${passedUser.id}`) == true ? "[🦊Owner]" : ""
        // check if Nickname is present, if not display "None" since value in field is required
        const passedUserNickname = passedUser.nickname != null ? `${passedUser.nickname}` : "None"
        // Uppercase first letter of status
        const passedUserStatus = passedUser.user.presence.status.charAt(0).toUpperCase() + passedUser.user.presence.status.slice(1);
        // display "None" if user playing status isn't set since value in field is required
        const passedUserPlaying = passedUser.user.presence.game != null ? `${passedUser.user.presence.game.name}` : "None"
        // calculate ages
        var passedUserAccountAge = Math.floor((Date.now() - passedUser.user.createdAt) / 1000 / 60 / 60 / 24);
        var passedUserMemberAge = Math.floor((Date.now() - passedUser.joinedAt) / 1000 / 60 / 60 / 24);
        // rolelist, push everything BUT everyone (guild ID = role ID)
        var roleList = [];
        passedUser.roles.forEach(role => {
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
                color: passedUser.displayColor,
                author: {
                    name: `${isOwner} ${isWhitelisted}${isBlacklisted}${isBot} ${passedUser.user.tag}`,
                    icon_url: passedUser.user.avatarURL
                },
                title: "ID",
                description: `${passedUser.user.id}`,
                thumbnail: {
                    url: passedUser.user.avatarURL
                },
                fields: [{
                        name: "Mention",
                        value: `<@${passedUser.user.id}>`,
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
                        value: `${passedUser.serverDeaf}`,
                        inline: true
                    },
                    {
                        name: `Server Muted`,
                        value: `${passedUser.serverMute}`,
                        inline: true
                    },
                    {
                        name: "Created On",
                        value: `${passedUser.user.createdAt.toISOString().slice(0,10)}`,
                        inline: true
                    },
                    {
                        name: "Join Date",
                        value: `${passedUser.joinedAt.toISOString().slice(0,10)}`,
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
    // if there is no mention part
    if (!mention) {
        message.channel.send(createUserEmbed(message.member, message));
        message.delete(4000);
        return;
    }
    if (util.getGuildMember(mention, message)) {
        message.channel.send(createUserEmbed(util.getGuildMember(mention, message), message));
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
