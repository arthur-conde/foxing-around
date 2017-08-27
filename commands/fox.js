exports.run = (client, message) => {
  const ranfoxconfig = require("../ranfoxconfig.json");
  var foximg = ranfoxconfig.foxes[Math.floor(Math.random() * ranfoxconfig.foxes.length)];
  message.channel.send({
    embed: {
      color: message.guild.me.displayColor,
      description: `Here is the fox you asked for, <@${message.member.id}>:`,
      image: {
        url: foximg
      }
    }
  });
  message.delete(4000);
};
