exports.run = (client, message, [mention, ...reason]) => {
  const config = require("../config.json");

  if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
    message.channel.send({
      embed: {
        color: message.guild.me.displayColor,
        description: `:x: Sorry <@${message.member.id}>, I don't have the permissions to do that`
      }
    }).then(message => {
      message.guild.me.lastMessage.delete(6000);
    });
    message.delete(4000);
    return
  }
  if (message.mentions.users.size === 1) {
    const kickMember = message.mentions.members.first();
    kickMember.kick(reason.join(" ")).then(member => {
      message.channel.send({
        embed: {
          color: message.guild.me.displayColor,
          description: `:white_check_mark: <@${message.member.id}>, ${kickMember.displayName} | <@${kickMember.id}> | (ID: ${kickMember.id}) was succesfully kicked.`
        }
      })
    });
    message.delete(4000);
    return;
  }
  if (message.guild.members.get(`${mention}`) !== undefined) {
    const kickMember = message.guild.members.get(`${mention}`);
    kickMember.kick(reason.join(" ")).then(member => {
      message.channel.send({
        embed: {
          color: message.guild.me.displayColor,
          description: `:white_check_mark: <@${message.member.id}>, ${kickMember.displayName} | <@${kickMember.id}> | (ID: ${kickMember.id}) was succesfully kicked.`
        }
      })
    });
    message.delete(4000);
    return;
  }
  var nickUserName = message.guild.members.find(function(member) {
    if (member.nickname != null) {
      if (member.nickname.toUpperCase() == mention.toUpperCase())
        return true;
    }
    if (member.user.username.toUpperCase() == mention.toUpperCase())
      return true;
  })
  if (nickUserName != null) {
    nickUserName.kick(reason.join(" ")).then(member => {
      message.channel.send({
        embed: {
          color: message.guild.me.displayColor,
          description: `:white_check_mark: <@${message.member.id}>, ${nickUserName.displayName} | <@${nickUserName.id}> | (ID: ${nickUserName.id}) was succesfully kicked.`
        }
      })
    });
    message.delete(4000);
    return;
  } else {
    message.channel.send({
      embed: {
        color: message.guild.me.displayColor,
        description: `:x: Sorry <@${message.member.id}>, **${mention}** is not a valid guild member`
      }
    }).then(message => {
      message.guild.me.lastMessage.delete(6000);
    });
    message.delete(4000);
  }
};
