exports.run = (client, message, args) => {
    message.channel.send(
      {embed:{color: message.guild.me.displayColor, description: ":ping_pong: ping!"}}
    );
}
