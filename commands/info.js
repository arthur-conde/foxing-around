exports.run = (client, message, args) => {
  const config = require("../config.json");

   if (message.mentions.users.size === 1) {
      const infoMember = message.mentions.members.first();
      const isBot = infoMember.user.bot == true ? "[BOT]" : "";
      const infoMemberNickname = infoMember.nickname != null ? `${infoMember.nickname}` : "None"
      const infoMemberStatus = infoMember.user.presence.status.charAt(0).toUpperCase() + infoMember.user.presence.status.slice(1);      var infoMemberAccountAge = Math.floor((Date.now() - infoMember.user.createdAt) / 1000 / 60 / 60 / 24);
      var infoMemberMemberAge = Math.floor((Date.now() - infoMember.joinedAt) / 1000 / 60 / 60 / 24);
      const infoMemberPlaying = infoMember.user.presence.game != null ? `${infoMember.user.presence.game.name}` : "None"
      const infoMemberCreated = new Date(Date.UTC(infoMember.user.createdAt));
      // const infoMemberJoined
      var roleList = [];
      for (i = 0; i < infoMember.roles.array().length; i++) {
        var rolelist = roleList + roles.Role.name;
        i =+ 1;
      }
      console.log(roleList);
      console.log(infoMember.user.createdAt);
      console.log(infoMemberCreated);
      console.log(infoMemberRoles);
      message.channel.send({embed:{
        color: infoMember.displayColor,
        author: {
          name: `${isBot} ${infoMember.user.username}#${infoMember.user.discriminator}`,
          icon_url: infoMember.user.avatarURL
        },
        title: "ID",
        description: `${infoMember.user.id}`,
        thumbnail: {
          url: infoMember.user.avatarURL
        },
        fields: [
          { name: "Mention",
            value: `<@${infoMember.user.id}>`,
            inline: true
          },
          { name: "Nickname",
            value: `${infoMemberNickname}`,
            inline: true
          },
          { name: "Status",
            value: `${infoMemberStatus}`,
            inline: true
          },
          { name: "Accountage",
            value: `${infoMemberAccountAge} day(s)`,
            inline: true
          },
          { name: "Memberage",
            value: `${infoMemberMemberAge} day(s)`,
            inline: true
          },
          { name: "Playing",
            value: `${infoMemberPlaying}`,
            inline: true
          },
          { name: "Created On",
            value: `${infoMember.user.createdAt}`,
            inline: false
          },
          { name: "Join Date",
            value: `${infoMember.joinedAt}`,
            inline: false
          }
        ]
      }});
      }
      message.delete(4000);
      return;
   /*
   if (message.guild.members.get(`${mention}`) !== undefined) {
      const kickMember = message.guild.members.get(`${mention}`);
      kickMember.kick(reason.join(" ")).then(member => {
        message.channel.send({embed:{color: message.guild.me.displayColor, description: `:white_check_mark: <@${message.member.id}>, ${kickMember.displayName} | <@${kickMember.id}> | (ID: ${kickMember.id}) was succesfully kicked.`
      }})});
      message.delete(4000);
      return;
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
       message.channel.send({embed:{color: message.guild.me.displayColor, description: `:white_check_mark: <@${message.member.id}>, ${nickUserName.displayName} | <@${nickUserName.id}> | (ID: ${nickUserName.id}) was succesfully kicked.`
     }})});
     message.delete(4000);
     return;
    } else {
    message.channel.send({embed:{color: message.guild.me.displayColor, description: `:x: Sorry <@${message.member.id}>, **${mention}** is not a valid guild member`}}).then( message => {
      message.guild.me.lastMessage.delete(6000);
    });
    message.delete(4000);
   }
   */
};
