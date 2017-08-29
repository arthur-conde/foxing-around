function createEmbed(color, message) {
    return {
        embed: {
            color: color,
            description: message
        }
    };
}

exports.createEmbed = (color, message) => createEmbed(color, message);
