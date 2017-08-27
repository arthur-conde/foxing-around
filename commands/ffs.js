exports.run = (client, message, args) => {
  message.channel.send({
    embed: {
      color: message.guild.me.displayColor,
      description: `<@${message.member.id}> seems to be upset about something...`,
      image: {
        url: "http://i.imgur.com/kimzFRM.png"
      }
    }
  });
  message.delete(4000);
}
