exports.run = (client, message, args) => {
    const config = require("../config.json");

    function clean(text) {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
    if (message.content.startsWith(config.prefix + "eval")) {
        if (message.author.id !== config.ownerID || message.author.id !== config.teachID) {
            console.log(`[!!!] unauthorized command invoke !eval by user <@${message.member.id}>,${message.member.displayName}, ${message.member.user.username}#${message.member.user.discriminator} || on <${message}>`);
            message.delete(4000);
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
                    }]
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
                    }]
                }
            });
        }
    }
    message.delete(4000);
};
