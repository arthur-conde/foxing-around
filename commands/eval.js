const Discord = require("discord.js");
const config = require("../config/config.json");
const util = require("../foxxo.util.js");
const u = require("util");
exports.run = (client, message, args) => {
    function clean(text) {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
    if (message.content.startsWith(config.prefix + "eval")) {
        if (!config.owner.includes(`${message.author.id}`)) {
            return;
        }
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send({
                embed: {
                    color: message.guild.me.displayColor,
                    description: `As you wish, <@${message.member.id}>:`,
                    fields: [{
                        name: "Evaluation",
                        value: `\`\`\`js\n${clean(evaled)}\n\`\`\``
                    }, {
                        name: "Input",
                        value: `\`\`\`\n${args.join(" ")}\`\`\``
                    }],
                    footer: {
                        text: `Request by ${message.member.displayName} (${message.author.id})`,
                        icon_url: message.author.avatarURL
                    }
                }
            });
        } catch (err) {
            message.channel.send({
                embed: {
                    color: message.guild.me.displayColor,
                    fields: [{
                        name: "Evaluation - Error",
                        value: `\`\`\`js\n${clean(err)}\n\`\`\``
                    }, {
                        name: "Input",
                        value: `\`\`\`${args.join(" ")}\`\`\``
                    }],
                    footer: {
                        text: `Request by ${message.member.displayName} (${message.author.id})`,
                        icon_url: message.author.avatarURL
                    }
                }
            });
        }
    }
    message.delete(4000);
};
