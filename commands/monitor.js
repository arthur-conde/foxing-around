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
                listMonitors.push(`[${i}] **<#${monitorconfig.voicechannels[i].voiceID}>** (${client.channels.get(monitorconfig.voicechannels[i].voiceID).guild.name}) => <#${monitorconfig.voicechannels[i].textID}> (${client.channels.get(monitorconfig.voicechannels[i].textID).guild.name})`)
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
        // check if entry is already in monitorconfig, if yes send error and break loop
        var found = false;
        for (i in monitorconfig.voicechannels) {
            if (monitorconfig.voicechannels[i].voiceID == monitorVoice && monitorconfig.voicechannels[i].textID == reportIn) {
                message.channel.send(util.createEmbed(16426522, `:x: <@${message.member.id}> monitor already exists`))
                    .then(message => {
                        message.guild.me.lastMessage.delete(6000);
                    });
                message.delete(4000)
                var found = true;
                break;
            }
        }
        if (found == true) {
            return;
        }
        // add the setup to config
        monitorconfig.voicechannels.push({
            "voiceID": `${monitorVoice}`,
            "textID": `${reportIn}`
        });
        //write the file, send confirmation
        fs.writeFile("./config/monitorconfig.json", JSON.stringify(monitorconfig, null, 4), (err) => console.error);
        message.channel.send(util.createEmbed(16426522, `:white_check_mark: <@${message.member.id}> succesfully added monitor for **<#${monitorVoice}>** (${client.channels.get(monitorVoice).guild.name}), reporting in <#${reportIn}> (${client.channels.get(reportIn).guild.name})`));
        message.delete(4000)
        return;
    }
    // if option is remove
    if (option == "remove" || option == "-") {
        // for every list entry in monitorconfig.voicechannels
        var found = false;
        if (monitorconfig.voicechannels[monitorVoice]) {
            // if it's not a .voiceID match, try to interpret it as array index, remove it, write file, send confirmation
            message.channel.send(util.createEmbed(16426522, `:white_check_mark: <@${message.member.id}> succesfully removed monitor for **<#${monitorconfig.voicechannels[monitorVoice].voiceID}>** (${client.channels.get(monitorconfig.voicechannels[monitorVoice].voiceID).guild.name}), reporting in <#${monitorconfig.voicechannels[monitorVoice].textID}> (${client.channels.get(monitorconfig.voicechannels[monitorVoice].textID).guild.name})`));
            monitorconfig.voicechannels.splice(monitorVoice, 1)
            fs.writeFile("./config/monitorconfig.json", JSON.stringify(monitorconfig, null, 4), (err) => console.error);
            found = true;
        } else {
            for (i in monitorconfig.voicechannels) {
                if (monitorconfig.voicechannels[i].voiceID == monitorVoice) {
                    //if monitorVoice matches a .voiceID entry remove it, write file, send confirmation
                    message.channel.send(util.createEmbed(16426522, `:white_check_mark: <@${message.member.id}> succesfully removed monitor for **<#${monitorconfig.voicechannels[i].voiceID}>** (${client.channels.get(monitorconfig.voicechannels[i].voiceID).guild.name}), reporting in <#${monitorconfig.voicechannels[i].textID}> (${client.channels.get(monitorconfig.voicechannels[i].textID).guild.name})`));
                    monitorconfig.voicechannels.splice(i, 1);
                    fs.writeFile("./config/monitorconfig.json", JSON.stringify(monitorconfig, null, 4), (err) => console.error);
                    found = true;
                }
            }
        }
        if (found == false) {
            message.channel.send(util.createEmbed(message.guild.me.displayColor, `:x: <@${message.member.id}>, no list entry found or invalid ID provided`))
                .then(message => {
                    message.guild.me.lastMessage.delete(6000);
                });
        }
    }
    message.delete(4000)
    return;
}
