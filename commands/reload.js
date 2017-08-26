exports.run = (client, message, args) => {
  if(!args || args.length < 1) {
    message.channel.send({embed:{color: message.guild.me.displayColor, description: `:x: <@${message.member.id}>, please provide a command to reload`}}).then( message => {
      message.guild.me.lastMessage.delete(4000);
    });
    message.delete(1000);
    return;
  }
  if (args == "foxes") {
    delete require.cache[require.resolve(`../ranfoxconfig.json`)];
    message.channel.send({embed:{color: message.guild.me.displayColor, description: `:fox: Foxes have been reloaded`}}).then( message => {
        message.guild.me.lastMessage.delete(4000);
    });
    message.delete(1000);
    return;
  }
  // the path is relative to the *current folder*, so just ./filename.js
  delete require.cache[require.resolve(`./${args[0]}.js`)];
  message.channel.send({embed:{color: message.guild.me.displayColor, description: `:white_check_mark: Okay, <@${message.member.id}> the command **${args[0]}** has been reloaded`}}).then( message => {
    message.guild.me.lastMessage.delete(4000);
  });
  message.delete(1000)
};
