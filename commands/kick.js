exports.run = (client, message, [mention, ...reason]) => {
  if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
    message.reply("you lack kicking perms")
    return message.reply("");
  }
  if (message.mentions.users.size === 0) {
    return message.reply("Please mention a user to kick");
  } else {
  const kickMember = message.mentions.members.first();
    kickMember.kick(reason.join(" ")).then(member => {
      message.reply(`${member.user.username} was succesfully kicked.`);
    });
  }
};
