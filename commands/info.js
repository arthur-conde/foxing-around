exports.run = (client, message, [mention, ...superfluous]) => {
  const config = require("../config.json");
  /*
  console.log(mention);
  if (mention == message.guild.id || "guild" || "server") {
    console.log("u ask for server");
  }*/

  //-------------------------------
/*  function postInfo (infoSubject) {
    const isBot = infoSubject.user.bot == true ? "[BOT]" : "";
    const infoSubjectNickname = infoSubject.nickname != null ? `${infoSubject.nickname}` : "None"
    const infoSubjectStatus = infoSubject.user.presence.status.charAt(0).toUpperCase() + infoSubject.user.presence.status.slice(1);      var infoSubjectAccountAge = Math.floor((Date.now() - infoSubject.user.createdAt) / 1000 / 60 / 60 / 24);
    var infoSubjectMemberAge = Math.floor((Date.now() - infoSubject.joinedAt) / 1000 / 60 / 60 / 24);
    const infoSubjectPlaying = infoSubject.user.presence.game != null ? `${infoSubject.user.presence.game.name}` : "None"
    const infoSubjectCreated = new Date(Date.UTC(infoSubject.user.createdAt));
    var roleList = [];
    infoSubject.roles.forEach(role => {if (message.guild.id == role.id) {return;} else {roleList.push(role.name)}});
    message.channel.send({embed:{
      color: infoSubject.displayColor,
      author: {
        name: `${isBot} ${infoSubject.user.username}#${infoSubject.user.discriminator}`,
        icon_url: infoSubject.user.avatarURL
      },
      title: "ID",
      description: `${infoSubject.user.id}`,
      thumbnail: {
        url: infoSubject.user.avatarURL
      },
      fields: [
        { name: "Mention",
          value: `<@${infoSubject.user.id}>`,
          inline: true
        },
        { name: "Nickname",
          value: `${infoSubjectNickname}`,
          inline: true
        },
        { name: "Status",
          value: `${infoSubjectStatus}`,
          inline: true
        },
        { name: "Playing",
          value: `${infoSubjectPlaying}`,
          inline: true
        },
        { name: "Accountage",
          value: `${infoSubjectAccountAge} day(s)`,
          inline: true
        },
        { name: "Memberage",
          value: `${infoSubjectMemberAge} day(s)`,
          inline: true
        },
        { name: `Server Deafened`,
          value: `${infoSubject.serverDeaf}`,
          inline: true
        },
        { name: `Server Muted`,
          value: `${infoSubject.serverMute}`,
          inline: true
        },
        { name: "Created On",
          value: `${infoSubject.user.createdAt}`,
          inline: false
        },
        { name: "Join Date",
          value: `${infoSubject.joinedAt}`,
          inline: false
        },
        { name: `Roles [${roleList.length}]`,
          value: `${roleList.join(", ")}`,
          inline: false
        }
      ]
    }});
    message.delete(4000);
    return;
    }
  }
  //-------------------------------
  if (message.mentions.users.size === 1) {
      postInfo(message.mentions.members.first());
*/
  if (message.mentions.users.size === 1) {
      const infoMember = message.mentions.members.first();
      const isBot = infoMember.user.bot == true ? "[BOT]" : "";
      const infoMemberNickname = infoMember.nickname != null ? `${infoMember.nickname}` : "None"
      const infoMemberStatus = infoMember.user.presence.status.charAt(0).toUpperCase() + infoMember.user.presence.status.slice(1);      var infoMemberAccountAge = Math.floor((Date.now() - infoMember.user.createdAt) / 1000 / 60 / 60 / 24);
      var infoMemberMemberAge = Math.floor((Date.now() - infoMember.joinedAt) / 1000 / 60 / 60 / 24);
      const infoMemberPlaying = infoMember.user.presence.game != null ? `${infoMember.user.presence.game.name}` : "None"
      const infoMemberCreated = new Date(Date.UTC(infoMember.user.createdAt));
      var roleList = [];
      infoMember.roles.forEach(role => {if (message.guild.id == role.id) {return;} else {roleList.push(role.name)}});
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
          { name: "Playing",
            value: `${infoMemberPlaying}`,
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
          { name: `Server Deafened`,
            value: `${infoMember.serverDeaf}`,
            inline: true
          },
          { name: `Server Muted`,
            value: `${infoMember.serverMute}`,
            inline: true
          },
          { name: "Created On",
            value: `${infoMember.user.createdAt}`,
            inline: false
          },
          { name: "Join Date",
            value: `${infoMember.joinedAt}`,
            inline: false
          },
          { name: `Roles [${roleList.length}]`,
            value: `${roleList.join(", ")}`,
            inline: false
          }
        ]
      }});
      message.delete(4000);
      return;
      }
   if (message.guild.members.get(`${mention}`) !== undefined) {
      const infoMember = message.guild.members.get(`${mention}`);
      const isBot = infoMember.user.bot == true ? "[BOT]" : "";
      const infoMemberNickname = infoMember.nickname != null ? `${infoMember.nickname}` : "None"
      const infoMemberStatus = infoMember.user.presence.status.charAt(0).toUpperCase() + infoMember.user.presence.status.slice(1);      var infoMemberAccountAge = Math.floor((Date.now() - infoMember.user.createdAt) / 1000 / 60 / 60 / 24);
      var infoMemberMemberAge = Math.floor((Date.now() - infoMember.joinedAt) / 1000 / 60 / 60 / 24);
      const infoMemberPlaying = infoMember.user.presence.game != null ? `${infoMember.user.presence.game.name}` : "None"
      const infoMemberCreated = new Date(Date.UTC(infoMember.user.createdAt));
      var roleList = [];

      infoMember.roles.forEach(role => {if (message.guild.id == role.id) {return;} else {roleList.push(role.name)}});
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
          { name: "Playing",
            value: `${infoMemberPlaying}`,
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
          { name: `Server Deafened`,
            value: `${infoMember.serverDeaf}`,
            inline: true
          },
          { name: `Server Muted`,
            value: `${infoMember.serverMute}`,
            inline: true
          },
          { name: "Created On",
            value: `${infoMember.user.createdAt}`,
            inline: false
          },
          { name: "Join Date",
            value: `${infoMember.joinedAt}`,
            inline: false
          },
          { name: `Roles [${roleList.length}]`,
            value: `${roleList.join(", ")}`,
            inline: false
          }
        ]
      }});
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
     const infoMember = nickUserName;
     const isBot = infoMember.user.bot == true ? "[BOT]" : "";
     const infoMemberNickname = infoMember.nickname != null ? `${infoMember.nickname}` : "None"
     const infoMemberStatus = infoMember.user.presence.status.charAt(0).toUpperCase() + infoMember.user.presence.status.slice(1);      var infoMemberAccountAge = Math.floor((Date.now() - infoMember.user.createdAt) / 1000 / 60 / 60 / 24);
     var infoMemberMemberAge = Math.floor((Date.now() - infoMember.joinedAt) / 1000 / 60 / 60 / 24);
     const infoMemberPlaying = infoMember.user.presence.game != null ? `${infoMember.user.presence.game.name}` : "None"
     const infoMemberCreated = new Date(Date.UTC(infoMember.user.createdAt));
     var roleList = [];

     infoMember.roles.forEach(role => {if (message.guild.id == role.id) {return;} else {roleList.push(role.name)}});
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
         { name: "Playing",
           value: `${infoMemberPlaying}`,
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
         { name: `Server Deafened`,
           value: `${infoMember.serverDeaf}`,
           inline: true
         },
         { name: `Server Muted`,
           value: `${infoMember.serverMute}`,
           inline: true
         },
         { name: "Created On",
           value: `${infoMember.user.createdAt}`,
           inline: false
         },
         { name: "Join Date",
           value: `${infoMember.joinedAt}`,
           inline: false
         },
         { name: `Roles [${roleList.length}]`,
           value: `${roleList.join(", ")}`,
           inline: false
         }
       ]
     }});
     message.delete(4000);
     return;
    } else {
    message.channel.send({embed:{color: message.guild.me.displayColor, description: `:x: Sorry <@${message.member.id}>, **${mention}** is not a valid guild member`}}).then( message => {
      message.guild.me.lastMessage.delete(6000);
    });
    message.delete(4000);
  }
};
