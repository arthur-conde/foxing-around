exports.run = (client, message, [mention, ...reason]) => {
  const config = require("../config.json");
  //message.channel.send(`${message}`);
  //message.channel.send(`${mention}`);
  //message.channel.send(`${reason}`);


  if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
    return message.channel.send({embed:{color: message.guild.me.displayColor, description: ":x: I don't have the permissions to do that"}});
  }
   if (message.mentions.users.size === 1) {
      const kickMember = message.mentions.members.first();
      return message.channel.send({embed:{color: message.guild.me.displayColor, description: `:white_check_mark: ${kickMember.displayName} | <@${kickMember.id}> | (ID: ${kickMember.id}) was succesfully kicked.`}});
   }
   if (message.guild.members.get(`${mention}`) !== undefined) {
      const kickMember = message.guild.members.get(`${mention}`);
      return message.channel.send({embed:{color: message.guild.me.displayColor, description: `:white_check_mark: ${kickMember.displayName} | <@${kickMember.id}> | (ID: ${kickMember.id}) was succesfully kicked.`}});
   }
   if (message.guild.members.find("nickname",`${mention}`) !== null) {
      const kickMember = message.guild.members.find("nickname",`${mention}`);
      return message.channel.send({embed:{color: message.guild.me.displayColor, description: `:white_check_mark: ${kickMember.displayName} | <@${kickMember.id}> | (ID: ${kickMember.id}) was succesfully kicked.`}});
   }
   if (message.guild.members.find("displayName",`${mention}`) !== null) {
      const kickMember = message.guild.members.find("displayName",`${mention}`);
      return message.channel.send({embed:{color: message.guild.me.displayColor, description: `:white_check_mark: ${kickMember.displayName} | <@${kickMember.id}> | (ID: ${kickMember.id}) was succesfully kicked.`}});
   }
    else {
    message.channel.send({embed:{color: message.guild.me.displayColor, description: `:x: Please specify a guild member`}})
   }
};
