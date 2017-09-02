function createEmbed(color, message) {
    return {
        embed: {
            color: color,
            description: message
        }
    };
}

function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}
exports.createEmbed = (color, message) => createEmbed(color, message);
exports.getRandInt = (min, max) => getRandInt(min, max);
