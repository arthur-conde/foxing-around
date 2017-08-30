const util = require("../foxxo.util.js");
exports.run = (client, message, args) => {
    message.channel.send(
        util.createEmbed(message.guild.me.displayColor, `:ping_pong: pong! **(response time: ${client.ping.toFixed(0)} ms)**`)
    ).then(message => {
        message.guild.me.lastMessage.delete(6000);
    });
    message.delete(4000)
}
