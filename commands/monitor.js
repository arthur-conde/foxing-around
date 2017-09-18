const config = require("../config/config.json");
const monitorconfig = require("../config/monitorconfig.json")
const util = require("../foxxo.util.js");
const Discord = require("discord.js");
const fs = require("fs")
exports.run = (client, message, args) => {
    var option = args[0];
    var monitorVoice = args[1];
    var reportIn = args[2];
    var viableOptions = ["add", "remove", "+", "-", "true"];
    // check if invoking user is owner
    if (!config.owner.includes(`${message.author.id}`)) {
        return;
    }
    if (!option || option == "true") {
        // show current monitors
        var listMonitors = []
        for (i in monitorconfig.voicechannels) {
            // only push monitorconfig.voicechannels entries for channels on the guild the command is invoked in or true argument is givens
            if (option == "true" || message.guild.channels.get(monitorconfig.voicechannels[i].voiceID)) {
                listMonitors.push(`[${i}] <#${monitorconfig.voicechannels[i].voiceID}> => <#${monitorconfig.voicechannels[i].textID}>`)
            }
        }
        message.channel.send(util.createEmbed(16426522, `:information_source:  <@${message.member.id}>, Active monitors:\r\n\r\n${listMonitors.length == 0 ? "None" : listMonitors.join("\r\n")}`));
        message.delete(4000)
        return;
    }
    // check if option is valid with array
    if (!viableOptions.includes(option)) {
        message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, **${option}** is not a valid option argument`))
            .then(message => {
                message.guild.me.lastMessage.delete(6000);
            });
        message.delete(4000)
        return;
    }
    // check options, if add
    if (option == "add" || option == "+") {
        // needs both arguments, if one is missing send error
        if (!reportIn || !monitorVoice) {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, missing arguments for \`!monitor add <voicechannel-id> <reportchannel-id>\``))
                .then(message => {
                    message.guild.me.lastMessage.delete(6000);
                });
            message.delete(4000)
            return;
        } else if (!client.channels.get(monitorVoice) || !client.channels.get(reportIn)) {
            // if channel ID is not a valid channel, send error
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, invalid channel id provided`))
                .then(message => {
                    message.guild.me.lastMessage.delete(6000);
                });
            message.delete(4000)
            return;
        }
        // add the setup to config
        monitorconfig.voicechannels.push({
            "voiceID": `${monitorVoice}`,
            "textID": `${reportIn}`
        });
        //write the file, send confirmation
        fs.writeFile("./config/monitorconfig.json", JSON.stringify(monitorconfig, null, 4), (err) => console.error);
        message.channel.send(util.createEmbed(16426522, `:white_check_mark: <@${message.member.id}> succesfully added monitor for <#${monitorVoice}>, reporting in <#${reportIn}>`));
        message.delete(4000)
        return;
    }
    // if option is remove
    if (option == "remove" || option == "-") {
        // for every list entry in monitorconfig.voicechannels
        var found = 0
        if (monitorconfig.voicechannels[monitorVoice]) {
            // if it's not a .voiceID match, try to interpret it as array index, remove it, write file, send confirmation
            message.channel.send(util.createEmbed(16426522, `:white_check_mark: <@${message.member.id}> succesfully removed monitor for <#${monitorconfig.voicechannels[monitorVoice].voiceID}>, reporting in <#${monitorconfig.voicechannels[monitorVoice].textID}>`));
            monitorconfig.voicechannels.splice(monitorVoice, 1)
            fs.writeFile("./config/monitorconfig.json", JSON.stringify(monitorconfig, null, 4), (err) => console.error);
            found = 1;
        } else {
            for (i in monitorconfig.voicechannels) {
                if (monitorconfig.voicechannels[i].voiceID == monitorVoice) {
                    //if monitorVoice matches a .voiceID entry remove it, write file, send confirmation
                    message.channel.send(util.createEmbed(16426522, `:white_check_mark: <@${message.member.id}> succesfully removed monitor for <#${monitorconfig.voicechannels[i].voiceID}>, reporting in <#${monitorconfig.voicechannels[i].textID}>`));
                    monitorconfig.voicechannels.splice(i, 1);
                    fs.writeFile("./config/monitorconfig.json", JSON.stringify(monitorconfig, null, 4), (err) => console.error);
                    found = 1;
                }
            }
        }
        if (found == 0) {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, no list entry found or invalid ID provided`))
                .then(message => {
                    message.guild.me.lastMessage.delete(6000);
                });
        }
    }
    message.delete(4000)
    return;
}
