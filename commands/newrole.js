const config = require("../config/config.json");
const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, args) => {
    function isRole(value, message) {
        let role = util.getGuildRole(value, message);
        if (role == null) {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${value}** is not a valid role`))
                .then(m => {
                    m.delete(config.clearTimeout);
                })
            message.delete(config.clearTimeout)
            return role;
        } else {
            return role;
        }
    }

    function isMember(value, message) {
        let user = util.getGuildMember(value, message);
        if (user == null) {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${value}** is not a valid user`))
                .then(m => {
                    m.delete(config.clearTimeout);
                })
            message.delete(config.clearTimeout)
            return user;
        } else {
            return user;
        }
    }
    // check permissions on invoking user (ignore)
    if (!message.member.hasPermission("MANAGE_ROLES")) {
        return;
    }
    // check permissions for bot (send error, delete)
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, I don't have the permissions to do that`))
            .then(m => {
                m.delete(config.clearTimeout);
            });
        message.delete(config.clearTimeout);
        return;
    }
    switch (args[0]) {
        case "c":
        case "create":
            {
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
                    // passes message, awaits messages (conig timelimit)
                    message.channel.awaitMessages(response => response.author.id === message.author.id, {
                            max: 1,
                            time: config.awaitDuration,
                            errors: [`time`],
                        })
                        .then(cm => {
                            if (cm.first().content == "cancel") {
                                message.delete();
                                msg.delete();
                                cm.first().delete();
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
                                    cm.first().delete(config.clearTimeout);
                                    msg.delete(config.clearTimeout);
                                    message.delete(config.clearTimeout);

                                })
                                .catch(e => {
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: ${e}`))
                                        .then(m => {
                                            m.delete(config.clearTimeout);
                                            msg.delete(config.clearTimeout);
                                            message.delete(config.clearTimeout);
                                            cm.first().delete(config.clearTimeout);
                                        })
                                })
                        })
                        .catch(e => {
                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, rolecreation canceled`))
                                .then(m => {
                                    m.delete(config.clearTimeout);
                                    msg.delete(config.clearTimeout);
                                    message.delete(config.clearTimeout);
                                    cm.first().delete(config.clearTimeout);
                                })
                        })
                })
                break;
            }
        case "delete":
            {
                role = isRole(args[1], message)
                if (role != null) {
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
                break;
            }
        case "color":
            {
                role = isRole(args[1], message)
                if (role != null) {
                    try {
                        role.setColor(args[2], `${message.member.user.tag} (${message.member.id})`)
                            .then(r => {
                                message.channel.send(util.createEmbed(r.color, `:white_check_mark: <@${message.member.id}> set rolecolor of ${r} to **${r.hexColor}**`))
                                message.delete(config.clearTimeout)
                                return;
                            })
                            .catch(e => {
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                            })
                        return;
                    } catch (e) {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, no or invalid color provided. Valid color formats are: \r\n **Hex Literal**, **Hex String** and **Number**`))
                            .then(m => {
                                m.delete(config.clearTimeout);
                            });
                        message.delete(config.clearTimeout)
                        return;
                    }
                }
                break;
            }
        case "name":
            {
                role = isRole(args[1], message)
                if (role != null) {
                    if (!args[2]) {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, no name provided to change to`))
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
                    return;
                }
                break;
            }
        case "hoist":
            {
                role = isRole(args[1], message)
                if (role != null) {
                    switch (args[2]) {
                        case undefined:
                            {
                                if (role.hoist == true) {
                                    role.setHoist(false, `${message.member.user.tag} (${message.member.id})`)
                                        .then(r => {
                                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for ${r} to **false**`))
                                            message.delete(config.clearTimeout)
                                            return;
                                        })
                                } else {
                                    role.setHoist(true, `${message.member.user.tag} (${message.member.id})`)
                                        .then(r => {
                                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for ${r} to **true**`))
                                            message.delete(config.clearTimeout)
                                            return;
                                        })
                                }
                                break;
                            }
                        case "1":
                        case "true":
                            {
                                role.setHoist(true, `${message.member.user.tag} (${message.member.id})`)
                                .then(r => {
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for ${r} to **true**`))
                                    message.delete(config.clearTimeout)
                                })
                                .catch(e => {
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                                })
                                break;
                            }
                        case "0":
                        case "false":
                            {
                                role.setHoist(false, `${message.member.user.tag} (${message.member.id})`)
                                .then(r => {
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set rolehoist for ${r} to **false**`))
                                    message.delete(config.clearTimeout)
                                })
                                .catch(e => {
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                                })
                                break;
                            }
                        default:
                            {
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${args[2]}** is not a valid argument, provide a boolean or leave empty to toggle`))
                                .then(m => {
                                    m.delete(config.clearTimeout);
                                });
                                message.delete(config.clearTimeout)
                                break;
                            }
                    }
                }
                break;
            }
        case "mention":
        case "mentionable":
            {
                role = isRole(args[1], message)
                if (role != null) {
                    switch (args[2]) {
                        case undefined:
                            {
                                if (role.mentionable == true) {
                                    role.setMentionable(false, `${message.member.user.tag} (${message.member.id})`)
                                        .then(r => {
                                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for ${r} to **false**`))
                                            message.delete(config.clearTimeout)
                                            return;
                                        })
                                } else {
                                    role.setMentionable(true, `${message.member.user.tag} (${message.member.id})`)
                                        .then(r => {
                                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for ${r} to **true**`))
                                            message.delete(config.clearTimeout)
                                            return;
                                        })
                                }
                                break;
                            }
                        case "1":
                        case "true":
                            {
                                role.setMentionable(true, `${message.member.user.tag} (${message.member.id})`)
                                .then(r => {
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for ${r} to **true**`))
                                    message.delete(config.clearTimeout)
                                })
                                .catch(e => {
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                                })
                                break;
                            }
                        case "0":
                        case "false":
                            {
                                role.setMentionable(false, `${message.member.user.tag} (${message.member.id})`)
                                .then(r => {
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set mentionable for ${r} to **false**`))
                                    message.delete(config.clearTimeout)
                                })
                                .catch(e => {
                                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${e}`))
                                })
                                break;
                            }
                        default:
                            {
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${args[2]}** is not a valid argument, provide a boolean or leave empty to toggle`))
                                .then(m => {
                                    m.delete(config.clearTimeout);
                                });
                                message.delete(config.clearTimeout)
                                break;
                            }
                    }
                }
                break;
            }
        case "permission":
        case "permissions":
            {
                role = isRole(args[1], message)
                if (role != null) {
                    //           0          1         2            3          4
                    // !role permissions <role> <add|remove> <permission> <permission> <p...
                    switch (args[2]) {
                        case "+":
                        case "add":
                            {
                                // create 2 new Discord.permissions
                                let oldPerms = new Discord.Permissions(role.permissions);
                                let newPerms = new Discord.Permissions(role.permissions);
                                // interpret rest of message as permission resolveables
                                let permissionArguments = args.slice(3);
                                // initialize invalid argument array
                                let invalidStrings = [];
                                for (i in permissionArguments) {
                                    let permToAdd = parseInt(permissionArguments[i]);
                                    if (isNaN(permToAdd)) {
                                        permToAdd = permissionArguments[i].toUpperCase();
                                    }
                                    try {
                                        if (!oldPerms.has(permToAdd)) {
                                            newPerms = newPerms.add(permToAdd);
                                        }
                                    } catch (e) {
                                        invalidStrings.push(permissionArguments[i]);
                                    }
                                }
                                // if old and new permissions are the same send errormessage
                                if (oldPerms.bitfield == newPerms.bitfield) {
                                    // if there are invalid strings send a message with them
                                    if (invalidStrings.length != 0) {
                                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${invalidStrings.join(" ")} are no valid permission resolveables`))
                                            .then(m => {
                                                m.delete(config.clearTimeout);
                                                message.delete(config.clearTimeout);
                                            })
                                    } else {
                                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, no changes were made to ${role}`))
                                            .then(m => {
                                                m.delete(config.clearTimeout);
                                                message.delete(config.clearTimeout);
                                            })
                                    }
                                } else {
                                    // only execute when permissions have changed
                                    // compare old and new permissions
                                    // use serialized versions
                                    let oldPermsSerial = oldPerms.serialize()
                                    let newPermsSerial = newPerms.serialize()
                                    // initialize array to hold changed permission names
                                    let changedPermissions = []
                                    for (var permission in oldPermsSerial) {
                                        if (oldPermsSerial[permission] != newPermsSerial[permission]) {
                                            changedPermissions.push(permission)
                                        }
                                    }
                                    // actually setting permissions here
                                    role.setPermissions(newPerms.bitfield, `${message.member.user.tag} (${message.member.id})`)
                                        .then(r => {
                                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}>, enabled permissions ${changedPermissions.join(", ")} for ${r} ${invalidStrings.length != 0 ? `, could not find permissions for: ${invalidStrings.join(", ")}`: ""}`))
                                        })
                                    message.delete(config.clearTimeout);
                                }
                                break;
                            }
                        case "-":
                        case "remove":
                            {
                                // create 2 new Discord.permissions
                                let oldPerms = new Discord.Permissions(role.permissions);
                                let newPerms = new Discord.Permissions(role.permissions);
                                // interpret rest of message as permission resolveables
                                let permissionArguments = args.slice(3);
                                // initialize invalid argument array
                                let invalidStrings = [];
                                for (i in permissionArguments) {
                                    let permToRemove = parseInt(permissionArguments[i]);
                                    if (isNaN(permToRemove)) {
                                        permToRemove = permissionArguments[i].toUpperCase();
                                    }
                                    try {
                                        if (oldPerms.has(permToRemove)) {
                                            newPerms = newPerms.remove(permToRemove);
                                        }
                                    } catch (e) {
                                        invalidStrings.push(permissionArguments[i]);
                                    }
                                }
                                // if old and new permissions are the same send errormessage
                                if (oldPerms.bitfield == newPerms.bitfield) {
                                    // if there are invalid strings send a message with them
                                    if (invalidStrings.length != 0) {
                                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${invalidStrings.join(" ")} are no valid permission resolveables`))
                                            .then(m => {
                                                m.delete(config.clearTimeout);
                                                message.delete(config.clearTimeout);
                                            })
                                    } else {
                                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, no changes were made to ${role}`))
                                            .then(m => {
                                                m.delete(config.clearTimeout);
                                                message.delete(config.clearTimeout);
                                            })
                                    }
                                } else {
                                    // only execute when permissions have changed
                                    // compare old and new permissions
                                    // use serialized versions
                                    let oldPermsSerial = oldPerms.serialize()
                                    let newPermsSerial = newPerms.serialize()
                                    console.log(newPerms.bitfield)
                                    // initialize array to hold changed permission names
                                    let changedPermissions = []
                                    for (var permission in oldPermsSerial) {
                                        if (oldPermsSerial[permission] != newPermsSerial[permission]) {
                                            changedPermissions.push(permission)
                                        }
                                    }
                                    // actually setting permissions here
                                    role.setPermissions(newPerms.bitfield, `${message.member.user.tag} (${message.member.id})`)
                                        .then(r => {
                                            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}>, denied permissions ${changedPermissions.join(", ")} for ${r} ${invalidStrings.length != 0 ? `, could not find permissions for: ${invalidStrings.join(", ")}`: ""}`))
                                        })
                                    message.delete(config.clearTimeout);
                                }
                                break;
                            }
                        case "set":
                            {}
                        default:
                            {
                                console.log("default")
                            }
                    }
                }
                break;
            }
        case "position":
            {}
        case "add":
            {}
        default:
            {
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, no or invalid option provided, valid options are: **${validOptions.join(", ")}**`))
                .then(m => {
                    m.delete(config.clearTimeout);
                });
                message.delete(config.clearTimeout)
                break;
            }
    }
    /*

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
                    */
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
