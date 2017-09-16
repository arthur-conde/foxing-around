const config = require("../config/config.json");
const monitorconfig = require("../config/monitorconfig.json");
const util = require("../foxxo.util.js");

exports.run = (client, oldMember, newMember) => {
    for (i in monitorconfig.voicechannels) {
        if (newMember.voiceChannel && monitorconfig.voicechannels[i].voiceID == newMember.voiceChannel.id) {
            newMember.guild.channels.get(monitorconfig.voicechannels[i].textID).send(util.createEmbed(newMember.guild.me.displayColor, `:sound: <@${newMember.id}> joined <#${monitorconfig.voicechannels[i].voiceID}>`))
            return;
        }
        if (oldMember.voiceChannel && !newMember.voiceChannel) {
            oldMember.guild.channels.get(monitorconfig.voicechannels[i].textID).send(util.createEmbed(oldMember.guild.me.displayColor, `:mute: <@${oldMember.id}> left <#${monitorconfig.voicechannels[i].voiceID}>`))
            return;
        }
    }
}
