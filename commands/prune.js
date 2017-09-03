const util = require("../foxxo.util.js");
const Discord = require("discord.js");
exports.run = (client, message, [amount, filter]) => {
    amount = Math.min(amount, 100)

    function massDeleteAndLog(message, messages, filteredBy) {
        if (messages.size > 0) {
            message.channel.bulkDelete(messages)
                .then(deletedMessages => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:put_litter_in_its_place: <@${message.member.id}> successfully deleted **${deletedMessages.size}** out of ${amount} checked messages matching: <@${filteredBy}>`)).then(message => {
                        message.guild.me.lastMessage.delete(6000);
                    });
                })
                .catch(console.error)
        } else {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **0** messages out of ${amount} checked messages matching: <@${filteredBy}>`)).then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        }
    }
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        console.log(`[!!!] unauthorized command invoke !prune by user <@${message.member.id}>,${message.member.displayName}, ${message.member.user.tag} || on <${amount}> - <${filter}`);
        message.delete(4000);
        return;
    }
    if (!amount || (!amount && !filter)) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, specify the amount of messages to prune`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (amount == 1) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, message amount needs to be between **2** and **100** to prune`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, I don't have the permissions to do that`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (isNaN(parseInt(amount))) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, first argument has to be the amount of messages to prune!`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    if (!filter) {
        message.delete(0)
            .then(deletedInvoke => {
                message.channel.bulkDelete(parseInt(amount))
                    .then(deletedMessages => {
                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:put_litter_in_its_place: <@${message.member.id}> successfully deleted **${deletedMessages.size}** messages`)).then(message => {
                            message.guild.me.lastMessage.delete(6000);
                        });
                    })
                    .catch(console.error)
                return;
            })
    }
    message.delete(0)
        .then(deletedInvoke => {
            message.channel.fetchMessages({
                    limit: amount
                })
                .then(messages => {
                    var filterBy = "empty"
                    if (message.mentions.users.size === 1) {
                        filterBy = message.mentions.members.first().id
                        messages = messages.filter(m => m.author.id === filterBy)
                        massDeleteAndLog(message, messages, filterBy)
                    } else {
                        client.fetchUser(filter, true)
                            .then(fetchedUser => {
                                filterBy = fetchedUser.id;
                                messages = messages.filter(m => m.author.id === filterBy)
                                massDeleteAndLog(message, messages, filterBy)
                            })
                            .catch(error => {
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, invalid filter`)).then(message => {
                                    message.guild.me.lastMessage.delete(6000);
                                });
                            })
                    }
                })
        })
}
