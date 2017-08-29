exports.run = (client, message, [mention, ...reason]) => {
  const config = require("../config.json");
  if (!mention) {
    message.channel.send({
      embed: {
        color: message.guild.me.displayColor,
        description: `:x: <@${message.member.id}>, please provide a guild member to unban`
      }
    }).then(message => {
      message.guild.me.lastMessage.delete(6000);
    });
    message.delete(4000);
    return;
  }
  if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
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
  if (!message.member.hasPermission("BAN_MEMBERS")) {
    console.log(`[!!!] unauthorized command invoke !unban by user <@${message.member.id}>,${message.member.displayName}, ${message.member.user.username}#${message.member.user.discriminator} || on <${mention}>`);
    message.delete(4000);
    return
  }
  const unbanMember = client.users.get(`${mention}`)

  console.log(unbanMember);
  message.guild.unban(`${mention}`).
  then(member => {
      message.channel.send({
        embed: {
          color: message.guild.me.displayColor,
          description: `:white_check_mark: ${mention} was succesfully unbanned.`
        }
      })
    })
    .catch(
      message.channel.send({
        embed: {
          color: message.guild.me.displayColor,
          description: `:x: Sorry <@${message.member.id}>, **${mention}** is not a banned ID`
        }
      })
      .then(message => {
        message.guild.me.lastMessage.delete(6000);
      }); message.delete(4000);
    )
};
