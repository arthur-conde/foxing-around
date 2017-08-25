exports.run = (client, message, [mention, ...reason]) => {
  const config = require("../config.json");

  if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
    return message.channel.send({embed:{color: message.guild.me.displayColor, description: ":x: I don't have the permissions to do that"}});
  }
   if (message.mentions.users.size === 1) {
      const kickMember = message.mentions.members.first();
      kickMember.kick(reason.join(" ")).then(member => {
        return message.channel.send({embed:{color: message.guild.me.displayColor, description: `:white_check_mark: ${kickMember.displayName} | <@${kickMember.id}> | (ID: ${kickMember.id}) was succesfully kicked.`
      }})});
   }
   if (message.guild.members.get(`${mention}`) !== undefined) {
      const kickMember = message.guild.members.get(`${mention}`);
      kickMember.kick(reason.join(" ")).then(member => {
        return message.channel.send({embed:{color: message.guild.me.displayColor, description: `:white_check_mark: ${kickMember.displayName} | <@${kickMember.id}> | (ID: ${kickMember.id}) was succesfully kicked.`
      }})});
   }
   var nickUserName = message.guild.members.find(function (member) {
    if (member.nickname != null)
    {
        if (member.nickname.toUpperCase() == mention.toUpperCase())
            return true;
    }
    if (member.user.username.toUpperCase() == mention.toUpperCase())
        return true;
})
   if (nickUserName != null) {
     nickUserName.kick(reason.join(" ")).then(member => {
       return message.channel.send({embed:{color: message.guild.me.displayColor, description: `:white_check_mark: ${nickUserName.displayName} | <@${nickUserName.id}> | (ID: ${nickUserName.id}) was succesfully kicked.`
     }})});
    } else {
    message.channel.send({embed:{color: message.guild.me.displayColor, description: `:x: Invalid guild member`}})
   }
};
