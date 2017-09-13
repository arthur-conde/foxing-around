const config = require("../config/config.json");
const Discord = require("discord.js");
exports.run = (client, message, args) => {
    amount = args[0];
    filter = args[1];
    string = args.slice(2).join(" ");
    amount = Math.min(amount, 100)

    function massDeleteAndLog(message, messages, filteredBy) {
        // check if there are more than 1 messages, since that's a requirement for bulkdelete
        if (messages.size > 1) {
            message.channel.bulkDelete(messages)
                .then(deletedMessages => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:put_litter_in_its_place: <@${message.member.id}> successfully deleted **${deletedMessages.size}** out of ${amount} checked messages matching: <@${filteredBy.id}> "${string}"`)).then(message => {
                        message.guild.me.lastMessage.delete(6000);
                    });
                })
                .catch(console.error)
            return;
        }
        // if there is exactly one message, call the first() of the messages collection returned by the filtering (since there is only one and delete it without bulkdelete)
        if (messages.size == 1) {
            messages.first().delete(0)
                .then(deletedMessages => {
                    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:put_litter_in_its_place: <@${message.member.id}> successfully deleted **1** out of ${amount} checked messages matching: <@${filteredBy.id}> "${string}"`)).then(message => {
                        message.guild.me.lastMessage.delete(6000);
                    });
                })
                .catch(console.error)
            return;
            // if there is no message in the collection
        } else {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **0** messages out of ${amount} checked messages matching: <@${filteredBy.id}>`)).then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
            return;
        }
    }
    // check for permissions on invoking user
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        console.log(`[!!!] unauthorized command invoke !prune by user <@${message.member.id}>,${message.member.displayName}, ${message.member.user.tag} || on <${amount}> - <${filter}`);
        message.delete(4000);
        return;
    }
    // check for permissions on bot
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, I don't have the permissions to do that`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    // if there are no amount or no amount and no filter
    if (!amount || (!amount && !filter)) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, specify the amount of messages to prune`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    // if the amount is 1
    if (amount == 1) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, message amount needs to be between **2** and **100** to prune`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    // if amount is not a number
    if (isNaN(parseInt(amount))) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, first argument has to be the amount of messages to prune!`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000);
        return;
    }
    // if there is no filter, don't filter by author (still filter if it's pinned)
    if (!filter) {
        message.delete(0)
            .then(deletedInvoke => {
                message.channel.fetchMessages({
                        limit: amount
                    })
                    .then(messages => {
                        messages = messages.filter(m => m.pinned === false)
                        message.channel.bulkDelete(messages)
                            .then(deletedMessages => {
                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:put_litter_in_its_place: <@${message.member.id}> successfully deleted **${deletedMessages.size}** messages`)).then(message => {
                                    message.guild.me.lastMessage.delete(6000);
                                });
                            })
                        return;
                    })

            })
        // if filter is specified
    } else {
        message.delete(0)
            .then(deletedInvoke => {
                message.channel.fetchMessages({
                        limit: amount
                    })
                    .then(messages => {
                        // try to find a member with the filter variable, if it's username, nickname, username#discrim or ID this will return a user object
                        var filterBy = util.getGuildMember(filter, message)
                        if (filterBy) {
                            // check if message author matches, it's not pinned and the messag filter (string) applies if provided (which is what the !== -1 does)
                            messages = messages.filter(m => m.author.id === filterBy.id && m.pinned === false && m.content.toUpperCase().indexOf(string.toUpperCase()) !== -1)
                            massDeleteAndLog(message, messages, filterBy)
                            // if getGuildMember didn't find anything try to fetch the member (possible ID of a user that already left)
                        } else {
                            client.fetchUser(filter, true)
                                .then(fetchedUser => {
                                    messages = messages.filter(m => m.author.id === fetchedUser.id && m.pinned === false && m.content.toUpperCase().indexOf(string.toUpperCase()) !== -1)
                                    massDeleteAndLog(message, messages, filterBy)
                                })
                                // if the fetch was unsuccessful treat the filter instead as string (message to be filtered by ==> allows for string searching without specifying a member)
                                .catch(error => {
                                    message.channel.fetchMessages({
                                            limit: amount
                                        })
                                        .then(messages => {
                                            // treat filter + the rest of the message as 1 string to check for
                                            // need to join since it's an array
                                            filter = args.slice(1).join(" ");
                                            messages = messages.filter(m => m.pinned === false && m.content.toUpperCase().indexOf(filter.toUpperCase()) !== -1)
                                            // if only no message
                                            if (messages.size == 0) {
                                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **0** messages out of ${amount} checked messages matching: "${filter}"`)).then(message => {
                                                    message.guild.me.lastMessage.delete(6000);
                                                })
                                                return;
                                            }
                                            // if only one message is found delete it without bulk
                                            if (messages.size == 1) {
                                                messages.first().delete()
                                                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:put_litter_in_its_place: <@${message.member.id}> successfully deleted **1** out of ${amount} checked messages matching: "${filter}"`)).then(message => {
                                                    message.guild.me.lastMessage.delete(6000);
                                                });
                                                return;
                                            } else {
                                                // if more than 1 is found delete via bulkdelete
                                                message.channel.bulkDelete(messages)
                                                    .then(deletedMessages => {
                                                        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:put_litter_in_its_place: <@${message.member.id}> successfully deleted **${deletedMessages.size}** out of ${amount} messages matching: "${filter}"`)).then(message => {
                                                            message.guild.me.lastMessage.delete(6000);
                                                        });
                                                    })
                                                return;
                                            }

                                        })
                                })
                        }
                    })

            })
    }
}
