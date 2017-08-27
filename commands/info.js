exports.run = (client, message, [mention, ...options]) => {
  const config = require("../config.json");
  if (mention == `${message.guild.id}` || mention == "guild" || mention == "server") {
    var onlineMembers = [];
    message.guild.members.forEach(member => {if (member.presence.status == "online" || member.presence.status == "dnd" || member.presence.status == "idle" ) {onlineMembers.push(member.id)} else {return}});
    var guildVoiceChannels = [];
    var guildTextChannels = [];
    message.guild.channels.forEach(channel => {if (channel.type == "voice") {guildVoiceChannels.push(channel)} if (channel.type == "text") {guildTextChannels.push(channel)} else { return }})
    var guildChannels = guildTextChannels.concat(guildVoiceChannels);
    var guildRoles = [];
    message.guild.roles.forEach(role => { if (role.id == message.guild.id) { return } else {guildRoles.push(`<@&${role.id}>`)}})
    var guildAge = Math.floor((Date.now() - message.guild.createdAt) / 1000 / 60 / 60 / 24);
    if (options.length == 0) {
      console.log(guildRoles);
    message.channel.send({embed:{
      color: message.guild.me.displayColor,
      author: {
        name: `${message.guild.name}`,
        icon_url: message.guild.iconURL
      },
      title: "ID",
      description: `${message.guild.id}`,
      thumbnail: {
        url: message.guild.iconURL
      },
      fields: [
        { name: "Region",
          value: `${message.guild.region}`,
          inline: true
        },
        { name: "Members",
          value: `${message.guild.memberCount} (${onlineMembers.length} online)`,
          inline: true
        },
        { name: `Channels [${guildChannels.length}]`,
          value: `text: ${guildTextChannels.length} | voice: ${guildVoiceChannels.length}`,
          inline: true
        },
        { name: "Guild Owner",
          value: `<@${message.guild.ownerID}>`,
          inline: true
        },
        { name: "Age",
          value: `${guildAge} day(s)`,
          inline: true
        },
        { name: "Roles",
          value: `${guildRoles.length}`,
          inline: true
        },
        { name: "Created On",
          value: `${message.guild.createdAt}`,
          inline: true
        },
      ]
    }});
    }
    if (options.toString().toUpperCase() == "roles".toUpperCase()) {
      message.channel.send({embed:{
        color: message.guild.me.displayColor,
        author: {
          name: `${message.guild.name} - Roles`,
          icon_url: message.guild.iconURL
        },
        description: `${guildRoles.join("\n")}`,
        thumbnail: {
          url: message.guild.iconURL
        }
    }});
    message.delete(4000);
    return;
    }
  }
  //-------------------------------
  function postUserInfo (infoUser, message) {
    const isBot = infoUser.user.bot == true ? "[BOT]" : "";
    const infoUserNickname = infoUser.nickname != null ? `${infoUser.nickname}` : "None"
    const infoUserStatus = infoUser.user.presence.status.charAt(0).toUpperCase() + infoUser.user.presence.status.slice(1);
    var infoUserAccountAge = Math.floor((Date.now() - infoUser.user.createdAt) / 1000 / 60 / 60 / 24);
    var infoUserMemberAge = Math.floor((Date.now() - infoUser.joinedAt) / 1000 / 60 / 60 / 24);
    const infoUserPlaying = infoUser.user.presence.game != null ? `${infoUser.user.presence.game.name}` : "None"
    const infoUserCreated = new Date(Date.UTC(infoUser.user.createdAt));
    var roleList = [];
    infoUser.roles.forEach(role => {if (message.guild.id == role.id) {return;} else {roleList.push(role.name)}});
    message.channel.send({embed:{
      color: infoUser.displayColor,
      author: {
        name: `${isBot} ${infoUser.user.username}#${infoUser.user.discriminator}`,
        icon_url: infoUser.user.avatarURL
      },
      title: "ID",
      description: `${infoUser.user.id}`,
      thumbnail: {
        url: infoUser.user.avatarURL
      },
      fields: [
        { name: "Mention",
          value: `<@${infoUser.user.id}>`,
          inline: true
        },
        { name: "Nickname",
          value: `${infoUserNickname}`,
          inline: true
        },
        { name: "Status",
          value: `${infoUserStatus}`,
          inline: true
        },
        { name: "Playing",
          value: `${infoUserPlaying}`,
          inline: true
        },
        { name: "Accountage",
          value: `${infoUserAccountAge} day(s)`,
          inline: true
        },
        { name: "Memberage",
          value: `${infoUserMemberAge} day(s)`,
          inline: true
        },
        { name: `Server Deafened`,
          value: `${infoUser.serverDeaf}`,
          inline: true
        },
        { name: `Server Muted`,
          value: `${infoUser.serverMute}`,
          inline: true
        },
        { name: "Created On",
          value: `${infoUser.user.createdAt}`,
          inline: false
        },
        { name: "Join Date",
          value: `${infoUser.joinedAt}`,
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
  //-------------------------------
  if (message.mentions.users.size === 1) {
      postUserInfo(message.mentions.members.first(), message);
  }
  if (message.guild.members.get(`${mention}`) !== undefined) {
     postUserInfo(message.guild.members.get(`${mention}`), message);
  }
  var nickUser = message.guild.members.find(function (member) {
   if (member.nickname != null)
   {
       if (member.nickname.toUpperCase() == mention.toUpperCase())
           return true;
   }
   if (member.user.username.toUpperCase() == mention.toUpperCase())
       return true;
})
  if (nickUser != null) {
    postUserInfo(nickUser, message);
  } else {
  message.channel.send({embed:{color: message.guild.me.displayColor, description: `:x: Sorry <@${message.member.id}>, can't find any information for **${mention}**`}}).then( message => {
    message.guild.me.lastMessage.delete(6000);
  });
  message.delete(4000);
  }
};
