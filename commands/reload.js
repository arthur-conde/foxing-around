const util = require("../foxxo.util.js");
exports.run = (client, message, args) => {
    var extensions = [".js", ".json"];
    var folders = ["./", "../"];

    for (var i in extensions) {
        for (var j in folders) {
            try {
                delete require.cache[require.resolve(`${folders[j]}${args[0]}${extensions[i]}`)];
                message.channel.send(util.createEmbed(message.guild.me.displayColor, `:white_check_mark: ${message.author}, **${args[0]}** has been reloaded`))
                    .then(message => {
                        message.guild.me.lastMessage.delete(6000);
                    });
                message.delete(4000);
                return;
            } catch (e) {}
        }
    }

    message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, invalid filename`))
        .then(message => {
            message.guild.me.lastMessage.delete(6000);
        });
    message.delete(4000);
    return;
}
