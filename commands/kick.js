exports.run = (client, message, args) => {
  message.reply("command started")
  const modRole = message.guild.roles.find("name", "Mods");
  message.reply("Searching for Modrole...")
  if (!modRole)
    return console.log("The Mods role does not exist");
  if (!message.member.roles.has(modRole.id))
    message.reply("You can't use this command.");

  if (message.mentions.users.size === 0) {
    message.reply("Please mention a user to kick");

    if (!message.guild.me.hasPermission("KICK_MEMBERS"))
      return message.reply("");
      message.reply("you lack kicking perms")

    const kickMember = message.mentions.members.first();

    kickMember.kick(reason.join(" ")).then(member => {
      message.reply(`${member.user.username} was succesfully kicked.`);
    });
  }
};
