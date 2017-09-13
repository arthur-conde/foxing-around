exports.run = (client, message) => {
    const foxconfig = require("../config/foxconfig.json");
    var foximg = foxconfig.foxes[Math.floor(Math.random() * foxconfig.foxes.length)];
    message.channel.send({
        embed: {
            color: message.guild.me.displayColor,
            description: `Here is the fox you asked for, <@${message.member.id}>:`,
            image: {
                url: foximg
            }
        }
    });
    message.delete(4000);
};
