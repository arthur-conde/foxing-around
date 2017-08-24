exports.run = (client, message, [mention, ...reason]) => {
  const config = require("../config.json");
  if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
    return message.channel.send({embed:{color: message.guild.me.displayColor, description: ":x: I don't have the permissions to do that"}});
  }
  if (message.mentions.users.size === 0) {
    return message.channel.send({embed:{color: message.guild.me.displayColor, description: ":x: Please mention a user to kick"}});
  } else {
  const kickMember = message.mentions.members.first();
    if (message.author.id === kickMember.id) {
      return message.channel.send({embed:{color: message.guild.me.displayColor, description: ":x: You can't kick yourself"}});
    }
    if (config.ownerID === kickMember.id) {
      return message.channel.send({embed:{color: message.guild.me.displayColor, description: `:x: You can't kick ${message.guild.members.get("83886770768314368").displayName}`}});
    }
    kickMember.kick(reason.join(" ")).then(member => {
      message.channel.send({embed:{color: message.guild.me.displayColor, description: `:white_check_mark: ${kickMember.displayName} | <@${kickMember.id}> | (ID: ${kickMember.id}) was succesfully kicked.`}});
    });
  }
};
