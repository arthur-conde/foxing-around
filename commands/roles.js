const config = require("../config.json");
const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, args) => {
    var option = args[0];
    var user = args[1];
    var roles = args.slice(2);
    if (!message.member.hasPermission("MANAGE_ROLES")) {
        console.log(`[!!!] unauthorized command invoke !role by user <@${message.member.id}>,${message.member.displayName}, ${message.member.user.tag} || on <${option} ${user} ${role}>`);
        return;
    }
    if (!option || !user || roles.length === 0) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, provide a full set of arguments in the form of \`!role <add | remove | set> <member> <role>\``))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (option != "add" && option != "remove" && option != "+" && option != "-" && option != "set") {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${option}** is not a valid argument`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
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
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (foundGuildRoles.length === 0) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, can't find a role for **${roles.join(", ")}**`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    } else {
        if (option == "add" || option == "+") {
            foundGuildMember.addRoles(foundGuildRoles)
                .then(member => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> added rol(e) ${listFoundGuildRoles.join(", ")} to ${foundGuildMember.displayName} | <@${foundGuildMember.id}> | ID: ${foundGuildMember.id}`))
                    message.delete(4000);
                    return;
                })
                .catch(error => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${error}`))
                        .then(message => {
                            message.guild.me.lastMessage.delete(6000);
                        });
                    message.delete(4000);
                })
        }
        if (option == "remove" || option == "-") {
            foundGuildMember.removeRoles(foundGuildRoles)
                .then(member => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> removed role(s) ${listFoundGuildRoles.join(", ")} from ${foundGuildMember.displayName} | <@${foundGuildMember.id}> | ID: ${foundGuildMember.id}`))
                })
                .catch(error => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${error}`))
                        .then(message => {
                            message.guild.me.lastMessage.delete(6000);
                            message.delete(4000);
                            return;
                        });
                    message.delete(4000);
                })
        }
        if (option == "set") {
            foundGuildMember.setRoles(foundGuildRoles)
                .then(member => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: <@${message.member.id}> set roles to ${listFoundGuildRoles.join(", ")} for ${foundGuildMember.displayName} | <@${foundGuildMember.id}> | ID: ${foundGuildMember.id}`))
                })
                .catch(error => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, ${error}`))
                        .then(message => {
                            message.guild.me.lastMessage.delete(6000);
                            message.delete(4000);
                            return;
                        });
                    message.delete(4000);
                })
        }
    }
}
