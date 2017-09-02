const config = require("../config.json");
const util = require("../foxxo.util.js");
exports.run = (client, message, [mention, args]) => {

    if (client.fetchUser(mention, true)) {
        client.fetchUser(mention).then(fetchedUser => {
                const isBot = fetchedUser.bot == true ? "🤖" : "";
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
                        ],
                        footer: {
                            text: `Request by ${message.member.displayName} (${message.author.id})`,
                            icon_url: message.author.avatarURL
                        }
                    }
                })
                return;
            })
            .catch(error => {
                if (client.fetchInvite(mention, true)) {
                    client.fetchInvite(mention).then(fetchedInvite => {
                        message.channel.send({
                            embed: {
                                color: message.guild.me.displayColor,
                                author: {
                                    name: `Invite: ${fetchedInvite.code} by ${fetchedInvite.inviter.tag}`,
                                    icon_url: fetchedInvite.inviter.avatarURL
                                },
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
                                        name: "URL",
                                        value: `${fetchedInvite.url}`,
                                        inline: false
                                    },
                                    {
                                        name: "Inviter",
                                        value: `${fetchedInvite.inviter.tag} (ID:${fetchedInvite.inviter.id})`,
                                        inline: false
                                    },
                                    {
                                        name: "Channel",
                                        value: `${fetchedInvite.channel.name} (ID:${fetchedInvite.channel.id})`,
                                        inline: false
                                    },
                                ]
                            }
                        })
                        return;
                    })
                } else {
                    return;
                }

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
