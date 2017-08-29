exports.run = (client, message, args) => {
    message.channel.send({
        embed: {
            color: message.guild.me.displayColor,
            description: `:ping_pong: pong! **(response time: ${client.ping.toFixed(0)} ms)**`
        }
    }).then(message => {
        message.guild.me.lastMessage.delete(6000);
    });
    message.delete(4000)
}
