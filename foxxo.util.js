// simple embed for bot responses
function createEmbed(color, message) {
    return {
        embed: {
            color: color,
            description: message
        }
    };
}
// random int generator
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}
// return user object for provided reference (username, nickname, mention, id, username#discrim) and message
// undefined if nothing is found
function getGuildMember(reference, message) {
    if (message.mentions.users.size === 1) {
        return message.mentions.members.first()
    }
    if (message.guild.members.get(`${reference}`) != undefined) {
        return message.guild.members.get(`${reference}`)
    }
    var queryUser = message.guild.members.find(function(member) {
        if (member.nickname != null) {
            if (member.nickname.toUpperCase() == reference.toUpperCase())
                return true;
        }
        if (`${member.user.tag}` == reference || member.user.username.toUpperCase() == reference.toUpperCase())
            return true;
    });
    if (queryUser) {
        return queryUser;
    } else {
        return undefined;
    }
}

// experimental



// return channel object for provided reference (channelname, mention, id) and message
// undefined if nothing is found




// experimental

exports.createEmbed = (color, message) => createEmbed(color, message);
exports.getRandInt = (min, max) => getRandInt(min, max);
exports.getGuildMember = (reference, message) => getGuildMember(reference, message);
