const config = require("../config.json");
const util = require("../foxxo.util.js");
exports.run = (client, message, [mention, args]) => {
    // if there is no mention part
    if (!mention || (mention.toUpperCase() != "MEMBER" && mention.toUpperCase() != "INVITE")) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, invalid fetch command, specify \`!fetch user <ID>\` or \`!fetch invite <code/url>\``))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return
    }
    if (mention.toUpperCase() == "USER") {
        client.fetchUser(args)
            .then(fetchedUser => {
                const isBot = fetchedUser.bot == true ? "[BOT]" : "";
                const fetchedUserStatus = fetchedUser.presence.status.charAt(0).toUpperCase() + fetchedUser.presence.status.slice(1);
                var fetchedUserAccountAge = Math.floor((Date.now() - fetchedUser.createdAt) / 1000 / 60 / 60 / 24);
                message.channel.send({
                    embed: {
                        color: message.guild.me.displayColor,
                        author: {
                            name: `${isBot} ${fetchedUser.tag}`,
                            icon_url: fetchedUser.avatarURL
                        },
                        title: "ID",
                        description: `${fetchedUser.id}`,
                        thumbnail: {
                            url: fetchedUser.avatarURL
                        },
                        fields: [{
                                name: "Mention",
                                value: `<@${fetchedUser.id}>`,
                                inline: true
                            },
                            {
                                name: "Status",
                                value: `${fetchedUserStatus}`,
                                inline: true
                            },
                            {
                                name: "Accountage",
                                value: `${fetchedUserAccountAge} day(s)`,
                                inline: true
                            },
                            {
                                name: "Created On",
                                value: `${fetchedUser.createdAt}`,
                                inline: false
                            },
                        ]
                    }
                })
                return;
            })
    }
    if (mention.toUpperCase() == "INVITE") {
        client.fetchInvite(args)
            .then(fetchedInvite => {
                /*console.log(fetchedInvite);
                var fetchedInviteLeft = (fetchedInvite.expiresAt - new Date(Date.UTC(fetchedInvite.createdAt))) / 1000 / 60;
                var fetchedInviteDuration = (fetchedInvite.expiresAt - fetchedInvite.createdAt) / 1000 / 60;*/
                message.channel.send({
                    embed: {
                        color: message.guild.me.displayColor,
                        author: {
                            name: `Inviter: ${fetchedInvite.inviter.tag} (ID:${fetchedInvite.inviter.id})`,
                            icon_url: fetchedInvite.inviter.avatarURL
                        },
                        title: "URL",
                        description: `${fetchedInvite.url}`,
                        thumbnail: {
                            url: fetchedInvite.guild.iconURL
                        },
                        fields: [{
                                name: "Code:",
                                value: `${fetchedInvite.code}`,
                                inline: true
                            },
                            {
                                name: "Guild:",
                                value: `${fetchedInvite.guild.name}`,
                                inline: true
                            },
                            {
                                name: "Channel",
                                value: `${fetchedInvite.channel.name} (ID:${fetchedInvite.channel.id})`,
                                inline: true
                            },
                            /*
                                                        {
                                                            name: "Expires in:",
                                                            value: `${fetchedInviteLeft} minute(s)`,
                                                            inline: true
                                                        },
                                                        {
                                                            name: "Duration",
                                                            value: `${fetchedInviteDuration}`,
                                                            inline: false
                                                        },
                                                        {
                                                            name: "Uses",
                                                            value: `${fetchedInvite.uses}/${fetchedInvite.maxUses} used`,
                                                            inline: false
                                                        },
                                                        {
                                                            name: "Created On",
                                                            value: `${fetchedInvite.createdAt}`,
                                                            inline: false
                                                        },
                                                        {
                                                            name: "Valid until",
                                                            value: `${fetchedInvite.expiresAt}`,
                                                            inline: false
                                                        },
                                                        */
                        ]
                    }
                })
            })
    } else {
        message.channel.send({
            embed: {
                color: message.guild.me.displayColor,
                description: `:x: <@${message.member.id}>, can't find any information for fetchrequest: **${mention}**`
            }
        }).then(message => {
            message.guild.me.lastMessage.delete(6000);
        });
    }
    message.delete(4000);
}
