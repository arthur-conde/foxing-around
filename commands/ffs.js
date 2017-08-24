exports.run = (client, message, args) => {
  message.channel.send(
    {embed:{color: message.guild.me.displayColor, image: {url: "http://i.imgur.com/kimzFRM.png"}}}
  );
}
