exports.run = (client, message, args) => {
  if(!args || args.size < 1) return message.reply({embed:{color: message.guild.me.displayColor, description: `:x: Provide a command to reload`}});
  if (args == "foxes") {
    delete require.cache[require.resolve(`../ranfoxconfig.json`)];
    message.channel.send(
      {embed:{color: message.guild.me.displayColor, description: `:fox: Foxes have been reloaded`}}
    );
    return;
  }
  // the path is relative to the *current folder*, so just ./filename.js
  delete require.cache[require.resolve(`./${args[0]}.js`)];
  message.channel.send(
    {embed:{color: message.guild.me.displayColor, description: `:white_check_mark: The command ${args[0]} has been reloaded`}}
  );
};
