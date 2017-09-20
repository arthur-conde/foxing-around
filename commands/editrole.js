const config = require("../config/config.json");
const util = require("../foxxo.util.js");
const fs = require("fs")

exports.run = (client, message, args) => {
    if (args[0] == "create") {
        message.guild.createRole({
                "name": args[1],
                "color": args[2],
                "permissions": parseInt(args[3])
            }, `${message.member.user.tag} (${message.member.id})`)
            .then(r => {
                message.channel.send(util.createEmbed(r.color, `:white_check_mark: <@${message.member.id}> created role <@&${r.id}> with name: **${args[1]}**, color: **${r.hexColor}**, permissions: **${args[3]}**`))
                message.delete(4000)
                return;
            })
            .catch(e => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                    .then(message => {
                        message.guild.me.lastMessage.delete(6000);
                    });
                message.delete(4000)
                return;
            })
        return;
    }
    if (args[0] == "delete") {
        util.getGuildRole(args[1], message).delete(`${message.member.user.tag} (${message.member.id})`)
            .then(r => {
                message.channel.send(util.createEmbed(r.color, `:white_check_mark: <@${message.member.id}> deleted role ${r.name}`))
                message.delete(4000)
                return;
            })
            .catch(e => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                    .then(message => {
                        message.guild.me.lastMessage.delete(6000);
                    });
                message.delete(4000)
                return;
            })
        return;
    }
    // interpret args[0] as role reference, return role object (after possibilities create and delete are checked, if those are true return and don't do anything below here)
    var role = util.getGuildRole(args[0], message)
    var option = args[1];
    var viableOptions = ["color", "name", "hoist", "mention", "create", "delete"];
    if (!message.member.hasPermission("MANAGE_ROLES")) {
        return;
    }
    if (args.length == 0) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, provide arguments`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000)
        return;
    }
    // if there are no arguments or args[1] is not a valid argument
    if (!args[1] || !viableOptions.includes(args[1])) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, viable options are: ${viableOptions.join(", ")}`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000)
        return;
    }
    if (args[1] == "color") {
        if (!args[2]) {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, please provide a color to change to`))
                .then(message => {
                    message.guild.me.lastMessage.delete(6000);
                });
            message.delete(4000)
            return;
        }
        role.setColor(args[2], `${message.member.user.tag} (${message.member.id})`)
            .then(r => {
                message.channel.send(util.createEmbed(r.color, `:white_check_mark: <@${message.member.id}> set rolecolor of <@&${r.id}> to **${args[2]}**`))
                message.delete(4000)
                return;
            })
            .catch(e => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
            })
    }
    if (args[1] == "name") {
        if (!args[2]) {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, please provide a name to change to`))
                .then(message => {
                    message.guild.me.lastMessage.delete(6000);
                });
            message.delete(4000)
            return;
        }
        role.setName(args.slice(2).join(" "), `${message.member.user.tag} (${message.member.id})`)
            .then(r => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolename of <@&${r.id}> to **${r.name}**`))
                message.delete(4000)
                return;
            })
            .catch(e => {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
            })
    }
    if (args[1] == "hoist") {
        if (!args[2]) {
            // toggle
            if (role.hoist == true) {
                role.setHoist(false, `${message.member.user.tag} (${message.member.id})`)
                    .then(r => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for <@&${r.id}> to **false**`))
                        message.delete(4000)
                        return;
                    })
                    .catch(e => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                    })
            } else {
                role.setHoist(true, `${message.member.user.tag} (${message.member.id})`)
                    .then(r => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for <@&${r.id}> to **true**`))
                        message.delete(4000)
                        return;
                    })
                    .catch(e => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                    })
            }
        }
        // set as provided
        if (args[2] == "true", `${message.member.user.tag} (${message.member.id})`) {
            role.setHoist(true)
                .then(r => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for <@&${r.id}> to **true**`))
                    message.delete(4000)
                    return;
                })
                .catch(e => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                })
        }
        if (args[2] == "false", `${message.member.user.tag} (${message.member.id})`) {
            role.setHoist(false)
                .then(r => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for <@&${r.id}> to **false**`))
                    message.delete(4000)
                    return;
                })
                .catch(e => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                })
        } else {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${args[2]}** is not a valid argument. Choose true, false or leave empty to toggle`))
                .then(message => {
                    message.guild.me.lastMessage.delete(6000);
                });
            message.delete(4000)
            return;
        }
    }
    if (args[1] == "mention") {
        if (!args[2]) {
            // toggle
            if (role.hoist == true) {
                role.setMentionable(false, `${message.member.user.tag} (${message.member.id})`)
                    .then(r => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for <@&${r.id}> to **false**`))
                        message.delete(4000)
                        return;
                    })
                    .catch(e => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                    })
            } else {
                role.setMentionable(true, `${message.member.user.tag} (${message.member.id})`)
                    .then(r => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for <@&${r.id}> to **true**`))
                        message.delete(4000)
                        return;
                    })
                    .catch(e => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                    })
            }
        }
        // set as provided
        if (args[2] == "true") {
            role.setMentionable(true, `${message.member.user.tag} (${message.member.id})`)
                .then(r => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for <@&${r.id}> to **true**`))
                    message.delete(4000)
                    return;
                })
                .catch(e => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                })
        }
        if (args[2] == "false") {
            role.setMentionable(false, `${message.member.user.tag} (${message.member.id})`)
                .then(r => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for <@&${r.id}> to **false**`))
                    message.delete(4000)
                    return;
                })
                .catch(e => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                })
        } else {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${args[2]}** is not a valid argument. Choose true, false or leave empty to toggle`))
                .then(message => {
                    message.guild.me.lastMessage.delete(6000);
                });
            message.delete(4000)
            return;
        }
    }
};
