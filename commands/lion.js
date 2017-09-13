exports.run = (client, message) => {
    const lionconfig = require("../config/lionconfig.json");
    var lionimg = lionconfig.lions[Math.floor(Math.random() * lionconfig.lions.length)];
    message.channel.send({
        embed: {
            color: message.guild.me.displayColor,
            description: `Here is the lion you asked for, <@${message.member.id}>:`,
            image: {
                url: lionimg
            }
        }
    });
    message.delete(4000);
};
