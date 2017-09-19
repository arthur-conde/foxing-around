const config = require("../config/config.json");
const monitorconfig = require("../config/monitorconfig.json");
const util = require("../foxxo.util.js");

exports.run = (client, oldMember, newMember) => {
    for (i in monitorconfig.voicechannels) {
        if (newMember.voiceChannel && monitorconfig.voicechannels[i].voiceID == newMember.voiceChannel.id) {
            client.channels.get(monitorconfig.voicechannels[i].textID).send(util.createEmbed(client.channels.get(monitorconfig.voicechannels[i].textID).guild.me.displayColor, `:inbox_tray:  <@${newMember.id}> joined <#${monitorconfig.voicechannels[i].voiceID}>`))
        } else if (oldMember.voiceChannel && monitorconfig.voicechannels[i].voiceID == oldMember.voiceChannel.id) {
            client.channels.get(monitorconfig.voicechannels[i].textID).send(util.createEmbed(client.channels.get(monitorconfig.voicechannels[i].textID).guild.me.displayColor, `:outbox_tray:  <@${oldMember.id}> left <#${monitorconfig.voicechannels[i].voiceID}>`))
        }
    }
}
