const config = require("../config/config.json");
const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, args) => {
    //var option = args[0];
    //var user = args[1];
    //var roles = args.slice(2);
    var validOptions = ["create", "delete", "color", "name", "hoist", "mentionable", "permissions", "position", "add", "remove", "set"];
    // check permissions on invoking user
    swtich(args[0])
    if (!message.member.hasPermission("MANAGE_ROLES")) {
        return;
    }
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, I don't have the permissions to do that`))
            .then(m => {
                m.delete(config.clearTimeout);
            });
        message.delete(config.clearTimeout);
        return;
    }
    // check if there is an option, and if provided option is in list validOptions
    if (!args[0] || !validOptions.includes(args[0])) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, no or invalid option provided, valid options are: **${validOptions.join(", ")}**`))
            .then(m => {
                m.delete(config.clearTimeout);
            });
        message.delete(config.clearTimeout)
        return;
    }
    // 1) create
    if (args[0] == "create") {
        // send notice for awaiting input
        message.channel.send({
                embed: {
                    author: {
                        name: `Awaiting Input - rolecreation`,
                        icon_url: message.guild.iconURL
                    },
                    color: message.guild.me.displayColor,
                    description: `**name**[string] **color**[hex/dec] **permissions**[number] **hoist**[true/false] **mentionable**[true/false] **position**[number]`,
                    thumbnail: {
                        url: message.guild.iconURL
                    },
                    footer: {
                        text: `Request by ${message.member.displayName} (${message.author.id})`,
                        icon_url: message.author.avatarURL
                    }
                }
            })
            .then(msg => {
                // passes message, awaits messages (30s timelimit)
                message.channel.awaitMessages(response => response.author.id === message.author.id, {
                        max: 1,
                        time: config.awaitDuration,
                        errors: [`time`],
                    })
                    .then(cm => {
                        if (cm.first().content == "cancel") {
                            message.delete()
                            msg.delete()
                            cm.first().delete()
                            return;
                        }
                        // pass collected message, split by space into subarguments (a)
                        let a = cm.first().content.split(/ +/g)
                        // convert string input to booleans
                        var hoist = (a[3] == "true" ? true : false);
                        var mentionable = (a[4] == "true" ? true : false);
                        message.guild.createRole({
                                "name": a[0],
                                "color": a[1],
                                "permissions": parseInt(a[2]),
                                "hoist": hoist,
                                "mentionable": mentionable,
                                "position": parseInt(a[5])
                            }, `${message.member.user.tag} (${message.member.id})`)
                            .then(r => {
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> succesfully created a role:`))
                                message.channel.send(util.createRoleEmbed(r, message))
                                cm.first().delete(config.clearTimeout)
                                msg.delete(config.clearTimeout)
                                message.delete(config.clearTimeout)

                            })
                            .catch(e => {
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: ${e}`))
                                    .then(m => {
                                        m.delete(config.clearTimeout)
                                        msg.delete(config.clearTimeout)
                                        message.delete(config.clearTimeout)
                                        cm.first().delete(config.clearTimeout)
                                    })
                            })
                    })
                    .catch(e => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, rolecreation canceled`))
                            .then(m => {
                                m.delete(config.clearTimeout)
                                msg.delete(config.clearTimeout)
                                message.delete(config.clearTimeout)
                                cm.first().delete(config.clearTimeout)
                            })
                    })
            })
        return;

    }

    // if command changes a role interpret args[1] as role, send error if unsuccessful
    if (validOptions.slice(1, 8).includes(args[0])) {
        if (!args[1]) {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, provide a role`))
                .then(message => {
                    message.guild.me.lastMessage.delete(config.clearTimeout);
                });
            message.delete(config.clearTimeout)
            return;
        }
        var role = util.getGuildRole(args[1], message);
        if (role == null) {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${args[0]}** is not a valid role`))
                .then(message => {
                    message.guild.me.lastMessage.delete(config.clearTimeout);
                });
            message.delete(config.clearTimeout)
            return;
        }
        // if successfully retrieved a role:
        if (args[0] == "delete") {
            role.delete(`${message.member.user.tag} (${message.member.id})`)
                .then(r => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> deleted a role:`))
                    message.channel.send(util.createRoleEmbed(r, message))
                    message.delete(config.clearTimeout)
                    return;
                })
                .catch(e => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                        .then(m => {
                            m.delete(config.clearTimeout);
                        });
                    message.delete(config.clearTimeout)
                    return;
                })
            return;
        }
        if (args[0] == "color") {
            if (!args[2]) {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, please provide a color to change to`))
                    .then(m => {
                        m.delete(config.clearTimeout);
                    });
                message.delete(config.clearTimeout)
                return;
            }
            role.setColor(args[2], `${message.member.user.tag} (${message.member.id})`)
                .then(r => {
                    message.channel.send(util.createEmbed(r.color, `:white_check_mark: <@${message.member.id}> set rolecolor of <@&${r.id}> to **${r.hexColor}**`))
                    message.delete(config.clearTimeout)
                    return;
                })
                .catch(e => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                })
            return;
        }
        if (args[0] == "name") {
            if (!args[2]) {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, please provide a name to change to`))
                    .then(m => {
                        m.delete(config.clearTimeout);
                    });
                message.delete(config.clearTimeout)
                return;
            }
            role.setName(args.slice(2).join(" "), `${message.member.user.tag} (${message.member.id})`)
                .then(r => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolename of <@&${r.id}> to **${r.name}**`))
                    message.delete(config.clearTimeout)
                    return;
                })
                .catch(e => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                })
            return;
        }
        if (args[0] == "hoist") {
            if (!args[2]) {
                // toggle if no value specified
                if (role.mentionable == true) {
                    role.setMentionable(false, `${message.member.user.tag} (${message.member.id})`)
                        .then(r => {
                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for <@&${r.id}> to **false**`))
                            message.delete(config.clearTimeout)
                            return;
                        })
                } else {
                    role.setMentionable(true, `${message.member.user.tag} (${message.member.id})`)
                        .then(r => {
                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for <@&${r.id}> to **true**`))
                            message.delete(config.clearTimeout)
                            return;
                        })
                }
                return;
            }
            // set as provided
            if (args[2] == "true") {
                role.setMentionable(true, `${message.member.user.tag} (${message.member.id})`)
                    .then(r => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for <@&${r.id}> to **true**`))
                        message.delete(config.clearTimeout)
                    })
                    .catch(e => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                    })
                return;
            }
            if (args[2] == "false") {
                role.setMentionable(false, `${message.member.user.tag} (${message.member.id})`)
                    .then(r => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for <@&${r.id}> to **false**`))
                        message.delete(config.clearTimeout)
                    })
                    .catch(e => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                    })
                return;
            } else {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${args[2]}** is not a valid argument. Choose true, false or leave empty to toggle`))
                    .then(m => {
                        m.delete(config.clearTimeout);
                    });
                message.delete(config.clearTimeout)
                return;
            }
        }
        if (args[0] == "mentionable") {
            if (!args[2]) {
                // toggle if no value specified
                if (role.mentionable == true) {
                    role.setMentionable(false, `${message.member.user.tag} (${message.member.id})`)
                        .then(r => {
                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for <@&${r.id}> to **false**`))
                            message.delete(config.clearTimeout)
                            return;
                        })
                } else {
                    role.setMentionable(true, `${message.member.user.tag} (${message.member.id})`)
                        .then(r => {
                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for <@&${r.id}> to **true**`))
                            message.delete(config.clearTimeout)
                            return;
                        })
                }
                return;
            }
            // set as provided
            if (args[2] == "true") {
                role.setMentionable(true, `${message.member.user.tag} (${message.member.id})`)
                    .then(r => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for <@&${r.id}> to **true**`))
                        message.delete(config.clearTimeout)
                    })
                    .catch(e => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                    })
                return;
            }
            if (args[2] == "false") {
                role.setMentionable(false, `${message.member.user.tag} (${message.member.id})`)
                    .then(r => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for <@&${r.id}> to **false**`))
                        message.delete(config.clearTimeout)
                    })
                    .catch(e => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                    })
                return;
            } else {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${args[2]}** is not a valid argument. Choose true, false or leave empty to toggle`))
                    .then(m => {
                        m.delete(config.clearTimeout);
                    });
                message.delete(config.clearTimeout)
                return;
            }
        }
        //           0          1         2            3
        // !role permissions <role> <add|remove> <permission>
        if (args[0] == "permissions") {
            if (args[2] == "add") {
                try {
                    // if 3 is a number parseint, else assume its a PERMISSION_RESOLVEABLE thus .touppercase and try that.
                    var rolePerm = new Discord.Permissions(role.permissions).add(/^\d+$/.test(args[3]) ? parseInt(args[3]) : args[3].toUpperCase());
                } catch (e) {
                    // if it's not a a permission number/resolveable throw error
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${args[2]} is not a valid permission**`))
                        .then(m => {
                            m.delete(config.clearTimeout);
                        });
                    message.delete(config.clearTimeout)
                    return;
                }
                // rolePerm is a bitmat with the new permissionset => set it to the specified role
                role.setPermissions(rolePerm.bitfield, `${message.member.user.tag} (${message.member.id})`)
                    .then(r => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> added permission **${args[3].toUpperCase()}** to <@&${r.id}>`))
                        message.delete(config.clearTimeout)
                        return;
                    })
            } else if (args[2] == "remove") {
                // same as add but with Discord.Permissions().remove
                try {
                    var rolePerm = new Discord.Permissions(role.permissions).remove(/^\d+$/.test(args[3]) ? parseInt(args[3]) : args[3].toUpperCase());
                } catch (e) {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${args[2]} is not a valid permission**`))
                        .then(m => {
                            m.delete(config.clearTimeout);
                        });
                    message.delete(config.clearTimeout)
                    return;
                }
                role.setPermissions(rolePerm.bitfield, `${message.member.user.tag} (${message.member.id})`)
                    .then(r => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> removed permission **${args[3].toUpperCase()}** from <@&${r.id}>`))
                        message.delete(config.clearTimeout)
                        return;
                    })
            } else {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, no or wrong parameter, valid parameters are **add** and **remove**`))
                    .then(m => {
                        m.delete(config.clearTimeout);
                    });
                message.delete(config.clearTimeout)
                return;
            }
        }
        if (args[0] == "position") {}
    }
    // if command changes a user interpret args[1] as user, send error if unsuccessful
    if (validOptions.slice(1, 6).includes(args[0])) {

    }
    /*




    var foundGuildMember = util.getGuildMember(user, message);
    var foundGuildRoles = []
    var listFoundGuildRoles = []
    for (i in roles) {
        var r = util.getGuildRole(roles[i], message);
        if (r) {
            foundGuildRoles.push(r)
            listFoundGuildRoles.push(`<@&${r.id}>`)

        } else {
            return;
        }
    }
    if (!foundGuildMember) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, can't find a guild member for **${user}**`))
            .then(message => {
                message.guild.me.lastMessage.delete(config.clearTimeout);
            });
        message.delete(config.clearTimeout);
        return;
    }
    if (foundGuildRoles.length === 0) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, can't find a role for **${roles.join(", ")}**`))
            .then(message => {
                message.guild.me.lastMessage.delete(config.clearTimeout);
            });
        message.delete(config.clearTimeout);
        return;
    } else {
        if (option == "add" || option == "+") {
            foundGuildMember.addRoles(foundGuildRoles)
                .then(member => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> added role(s) ${listFoundGuildRoles.join(", ")} to ${foundGuildMember.displayName} | <@${foundGuildMember.id}> | ID: ${foundGuildMember.id}`))
                    message.delete(config.clearTimeout);
                    return;
                })
                .catch(error => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${error}`))
                        .then(message => {
                            message.guild.me.lastMessage.delete(config.clearTimeout);
                        });
                    message.delete(config.clearTimeout);
                })
        }
        if (option == "remove" || option == "-") {
            foundGuildMember.removeRoles(foundGuildRoles)
                .then(member => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> removed role(s) ${listFoundGuildRoles.join(", ")} from ${foundGuildMember.displayName} | <@${foundGuildMember.id}> | ID: ${foundGuildMember.id}`));
                    message.delete(config.clearTimeout);
                    return;
                })
                .catch(error => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${error}`))
                        .then(message => {
                            message.guild.me.lastMessage.delete(config.clearTimeout);
                            message.delete(config.clearTimeout);
                            return;
                        });
                    message.delete(config.clearTimeout);
                })
        }
        if (option == "set") {
            foundGuildMember.setRoles(foundGuildRoles)
                .then(member => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set roles to ${listFoundGuildRoles.join(", ")} for ${foundGuildMember.displayName} | <@${foundGuildMember.id}> | ID: ${foundGuildMember.id}`));
                    message.delete(config.clearTimeout);
                    return;
                })
                .catch(error => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${error}`))
                        .then(message => {
                            message.guild.me.lastMessage.delete(config.clearTimeout);
                            message.delete(config.clearTimeout);
                            return;
                        });
                    message.delete(config.clearTimeout);
                })
        }
    }*/
}
